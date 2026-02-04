-- DELETE COURSES OUT OF ALIGNMENT WITH VIBE CODING
DELETE FROM public.courses WHERE id IN ('course-5', 'course-deepseek');
-- UPDATE REMAINING COURSES TO VIBE CODING PHILOSOPHY
UPDATE public.courses SET 
    title = 'AI Literacy 101',
    description = 'Perfect for complete beginners. Learn the basics of chatting with AI to get help with daily tasks.',
    total_prompts = 15
WHERE id = 'course-1';
UPDATE public.courses SET 
    title = 'Better Results with AI',
    description = 'Learn simple ways to get better answers, clearer writing, and more helpful suggestions from any AI.',
    total_prompts = 12,
    difficulty = 'beginner'
WHERE id = 'course-2';
UPDATE public.courses SET 
    title = 'AI for Daily Productivity',
    description = 'Use AI to handle emails, schedule your week, and organize your life or small business effortlessly.',
    total_prompts = 20
WHERE id = 'course-3';
UPDATE public.courses SET 
    title = 'Vibe Coding: Build Your Site',
    description = 'The easiest way to build a website. Just describe it to the AI and watch it happen. No code needed.',
    total_prompts = 15
WHERE id = 'course-4';
UPDATE public.courses SET 
    title = 'Mastering ChatGPT',
    description = 'Unlock the best features of ChatGPT for your personal and professional projects.',
    total_prompts = 10
WHERE id = 'course-chatgpt';
UPDATE public.courses SET 
    title = 'AI Smart Search',
    description = 'Stop Googling. Use Perplexity to find fast, sourced answers for your research and shopping.',
    total_prompts = 8
WHERE id = 'course-perplexity';
UPDATE public.courses SET 
    title = 'Creative Writing with Claude',
    description = 'The best partner for writing stories, blogs, or emails that sound like you, but better.',
    total_prompts = 12,
    difficulty = 'beginner'
WHERE id = 'course-claude';
UPDATE public.courses SET 
    title = 'Summarize Anything',
    description = 'Drop in long PDFs, contracts, or books and get the key points in seconds with Kimi AI.',
    total_prompts = 10
WHERE id = 'course-kimi';
UPDATE public.courses SET 
    title = 'AI for Media & Images',
    description = 'Use Google Gemini to create, edit, and understand images and videos for your social media.',
    total_prompts = 12
WHERE id = 'course-gemini';
-- ADD NEW ADVANCED VIBE COURSE
INSERT INTO public.courses (id, title, description, difficulty, total_prompts, icon_name, color, created_at)
VALUES (
    'course-advanced-vibe', 
    'Advanced Vibe Projects', 
    'Build complex interactive tools and dashboards just by talking to the AI. Take your vibe coding to the next level.', 
    'advanced', 
    20, 
    'Rocket', 
    '#ef4444', 
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    difficulty = EXCLUDED.difficulty,
    total_prompts = EXCLUDED.total_prompts;
