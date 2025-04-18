import { getServiceSupabase } from "./supabaseClient";

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
    
    console.log('Conexión exitosa a Supabase');
    console.log('Buckets disponibles:', buckets);
    return true;
    
  } catch (error) {
    console.error('Error en la conexión a Supabase:', error);
    return false;
  }
}

// Ejecutar la prueba
testSupabaseConnection().then(result => {
  console.log('Resultado de la prueba:', result ? 'Éxito' : 'Fallo');
}); 