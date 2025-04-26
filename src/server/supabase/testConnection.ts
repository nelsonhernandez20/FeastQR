import { getServiceSupabase } from "./supabaseClient";
import { storageBucketsNames } from "./supabaseClient";

async function testSupabaseConnection() {
  try {
    const supabase = getServiceSupabase();
    
    // Intentar obtener la lista de buckets de almacenamiento
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error al listar buckets:', bucketsError);
      return false;
    }
    
    // Verificar si el bucket menus-files existe
    const menusBucketExists = buckets.some(bucket => bucket.name === storageBucketsNames.menus);
    
    if (!menusBucketExists) {
      console.log('Bucket menus-files no existe, creando...');
      const { error: createError } = await supabase
        .storage
        .createBucket(storageBucketsNames.menus, {
          public: false,
          fileSizeLimit: 52428800, // 50MB
        });
      
      if (createError) {
        console.error('Error al crear el bucket:', createError);
        return false;
      }
      console.log('Bucket menus-files creado exitosamente');
    } else {
      console.log('Bucket menus-files ya existe');
    }
    
    console.log('Conexión exitosa a Supabase');
    return true;
    
  } catch (error) {
    console.error('Error en la conexión a Supabase:', error);
    return false;
  }
}

// Ejecutar la prueba
testSupabaseConnection().then(success => {
  if (success) {
    console.log('Prueba completada exitosamente');
  } else {
    console.error('La prueba falló');
  }
}); 