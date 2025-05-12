const { createClient } = require('@supabase/supabase-js')
const { supabaseUrl, supabaseKey, supabaseBucketName } = require('../config/config')
const supabase = createClient(supabaseUrl, supabaseKey)
const fs = require('fs')

exports.uploadImage = async (fileName, filePath) => {
    const { error } = await supabase.storage
        .from(supabaseBucketName)
        .upload(fileName, fs.readFileSync(filePath))
    return { errorSupabase: error }
};

exports.getImageUrl = async (fileName, filePath) => {
    const { data, error } = supabase.storage
        .from(supabaseBucketName)
        .getPublicUrl(fileName)
    return data
};

exports.deleteImage = async (fileName) => {
    await supabase.storage
        .from(supabaseBucketName)
        .remove(fileName)
};
