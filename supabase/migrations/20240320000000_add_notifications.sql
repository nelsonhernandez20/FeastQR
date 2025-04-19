-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.notifications;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.notifications;
DROP POLICY IF EXISTS "Enable update for menu owners" ON public.notifications;
DROP POLICY IF EXISTS "Enable delete for menu owners" ON public.notifications;

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_slug TEXT NOT NULL REFERENCES public.menus(slug) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    location_info TEXT NOT NULL,
    additional_notes TEXT,
    payment_proof_url TEXT,
    payment_proof_filename TEXT,
    payment_proof_bucket TEXT,
    payment_proof_path TEXT,
    payment_amount FLOAT,
    payment_currency TEXT,
    payment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on menu_slug if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_notifications_menu_slug ON public.notifications(menu_slug);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON public.notifications
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for menu owners" ON public.notifications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.menus
            WHERE menus.slug = notifications.menu_slug
            AND menus.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable delete for menu owners" ON public.notifications
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.menus
            WHERE menus.slug = notifications.menu_slug
            AND menus.user_id = auth.uid()
        )
    ); 