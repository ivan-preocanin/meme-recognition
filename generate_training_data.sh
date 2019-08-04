rm -rf train/*
../tesseract/tesseract/src/training/tesstrain.sh \
    --fonts_dir fonts \
    --fontlist 'Impact Condensed' \
    --lang eng \
    --langdata_dir ../tesseract/langdata_lstm \
    --tessdata_dir ../tesseract/tessdata \
    --linedata_only \
    --save_box_tiff \
    --maxpages 10 \
    --output_dir train
     