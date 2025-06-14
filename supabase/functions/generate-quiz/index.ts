
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting quiz generation...');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { topic, difficulty = 'medium', questionCount = 5 } = await req.json();
    console.log('Quiz request:', { topic, difficulty, questionCount });

    const prompt = `Generate ${questionCount} multiple choice questions about "${topic}" with ${difficulty} difficulty level.

    Format your response as a JSON array with this exact structure:
    [
      {
        "question": "Question text here?",
        "option_a": "First option",
        "option_b": "Second option", 
        "option_c": "Third option",
        "option_d": "Fourth option",
        "correct_answer": "A"
      }
    ]

    Rules:
    - Make questions relevant to the topic
    - Ensure only one correct answer per question
    - Make distractors plausible but clearly wrong
    - Use clear, concise language
    - Return only valid JSON, no extra text`;

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert quiz generator. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI');
    }
    
    const generatedContent = data.choices[0].message.content;
    console.log('Generated content:', generatedContent);
    
    let questions;
    try {
      questions = JSON.parse(generatedContent);
    } catch (e) {
      console.error('Failed to parse generated questions:', e);
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to parse generated questions');
    }

    if (!Array.isArray(questions)) {
      throw new Error('Generated content is not an array');
    }

    console.log('Creating quiz session...');
    // Create quiz session
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: user.id,
        topic,
        difficulty,
        total_questions: questions.length
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      throw sessionError;
    }

    console.log('Inserting questions...');
    // Insert questions
    const questionsToInsert = questions.map((q: any) => ({
      quiz_session_id: session.id,
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer
    }));

    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert);

    if (questionsError) {
      console.error('Questions insertion error:', questionsError);
      throw questionsError;
    }

    console.log('Quiz generation successful!');
    return new Response(JSON.stringify({ 
      session_id: session.id,
      questions: questions.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating quiz:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
