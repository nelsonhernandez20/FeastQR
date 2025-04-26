-- Crear el tipo enum tag_type si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tag_type') THEN
        CREATE TYPE "public"."tag_type" AS ENUM (
            'keto', 
            'vegan', 
            'vegetarian', 
            'low_carb', 
            'sugar_free', 
            'low_fat', 
            'high_protein', 
            'high_fiber', 
            'organic', 
            'gluten_free', 
            'lactose_free'
        );
    END IF;
END$$;

-- Asegurarse de que la tabla dishes_tag existe
CREATE TABLE IF NOT EXISTS "public"."dishes_tag" (
    "dish_id" uuid,
    "tag_name" tag_type NOT NULL
);

-- Añadir restricciones si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dishes_tag_pkey') THEN
        ALTER TABLE "public"."dishes_tag" ADD CONSTRAINT "dishes_tag_pkey" PRIMARY KEY (tag_name);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dishes_tag_dish_id_fkey') THEN
        ALTER TABLE "public"."dishes_tag" ADD CONSTRAINT "dishes_tag_dish_id_fkey" 
        FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE;
    END IF;
END$$;

-- Habilitar RLS si no está habilitado
ALTER TABLE "public"."dishes_tag" ENABLE ROW LEVEL SECURITY; 