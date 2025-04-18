-- Crear esquemas si no existen
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS public;

-- Tablas del esquema auth
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID,
    aud VARCHAR(255),
    role VARCHAR(255),
    email VARCHAR(255),
    encrypted_password VARCHAR(255),
    email_confirmed_at TIMESTAMPTZ,
    invited_at TIMESTAMPTZ,
    confirmation_token VARCHAR(255),
    confirmation_sent_at TIMESTAMPTZ,
    recovery_token VARCHAR(255),
    recovery_sent_at TIMESTAMPTZ,
    email_change_token_new VARCHAR(255),
    email_change VARCHAR(255),
    email_change_sent_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    raw_app_meta_data JSONB,
    raw_user_meta_data JSONB,
    is_super_admin BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    phone VARCHAR(255) UNIQUE,
    phone_confirmed_at TIMESTAMPTZ,
    phone_change VARCHAR(255) DEFAULT '',
    phone_change_token VARCHAR(255) DEFAULT '',
    phone_change_sent_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current VARCHAR(255) DEFAULT '',
    email_change_confirm_status SMALLINT DEFAULT 0,
    banned_until TIMESTAMPTZ,
    reauthentication_token VARCHAR(255) DEFAULT '',
    reauthentication_sent_at TIMESTAMPTZ,
    is_sso_user BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS auth.identities (
    id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    identity_data JSONB,
    provider TEXT,
    last_sign_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    PRIMARY KEY (provider, id)
);

CREATE TABLE IF NOT EXISTS auth.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    factor_id UUID,
    aal TEXT,
    not_after TIMESTAMPTZ
);

-- Tablas del esquema public
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    username VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS public.menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE,
    background_image_url TEXT,
    city VARCHAR(255),
    address TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    contact_number VARCHAR(255),
    facebook_url TEXT,
    google_review_url TEXT,
    instagram_url TEXT,
    logo_image_url TEXT
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price INTEGER NOT NULL,
    picture_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id),
    carbohydrates INTEGER,
    fats INTEGER,
    protein INTEGER,
    weight INTEGER,
    calories INTEGER
);

CREATE TABLE IF NOT EXISTS public.languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE,
    iso_code VARCHAR(10),
    flag_url TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.categories_translation (
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (category_id, language_id)
);

CREATE TABLE IF NOT EXISTS public.dishes_translation (
    dish_id UUID REFERENCES public.dishes(id) ON DELETE CASCADE,
    language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    PRIMARY KEY (dish_id, language_id)
);

CREATE TABLE IF NOT EXISTS public.dish_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dish_id UUID REFERENCES public.dishes(id) ON DELETE CASCADE,
    price INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.variant_translations (
    variant_id UUID REFERENCES public.dish_variants(id) ON DELETE CASCADE,
    language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (variant_id, language_id)
);

CREATE TABLE IF NOT EXISTS public.menu_languages (
    menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE,
    language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT false,
    PRIMARY KEY (menu_id, language_id)
);

CREATE TABLE IF NOT EXISTS public.dishes_tag (
    dish_id UUID REFERENCES public.dishes(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    PRIMARY KEY (dish_id, tag_name)
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE NO ACTION,
    update_payment_url TEXT NOT NULL,
    renews_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lemon_squeezy_id VARCHAR(255) NOT NULL,
    json_data JSONB NOT NULL
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_users_instance_id ON auth.users(instance_id);
CREATE INDEX IF NOT EXISTS idx_identities_email ON auth.identities(email);
CREATE INDEX IF NOT EXISTS idx_identities_user_id ON auth.identities(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_menus_slug ON public.menus(slug);
CREATE INDEX IF NOT EXISTS idx_categories_menu_id ON public.categories(menu_id);
CREATE INDEX IF NOT EXISTS idx_dishes_menu_id ON public.dishes(menu_id);
CREATE INDEX IF NOT EXISTS idx_dishes_category_id ON public.dishes(category_id);
CREATE INDEX IF NOT EXISTS idx_dish_variants_dish_id ON public.dish_variants(dish_id);
CREATE INDEX IF NOT EXISTS idx_menu_languages_menu_id ON public.menu_languages(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_languages_language_id ON public.menu_languages(language_id);
CREATE INDEX IF NOT EXISTS idx_dishes_tag_dish_id ON public.dishes_tag(dish_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories_translation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes_translation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variant_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes_tag ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad básicas
CREATE POLICY "Enable read access for all users" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.menus
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.dishes
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.languages
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.categories_translation
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.dishes_translation
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.dish_variants
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.variant_translations
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.menu_languages
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.dishes_tag
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.subscriptions
    FOR SELECT USING (true);

-- Crear políticas de escritura para usuarios autenticados
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for authenticated users only" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.menus
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for authenticated users only" ON public.menus
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for authenticated users only" ON public.menus
    FOR DELETE USING (auth.uid() = user_id); 