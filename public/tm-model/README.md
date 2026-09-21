# ملفات نموذج Teachable Machine

هذا المجلد يحتوي على ملفات نموذج التصنيف.

## الملفات المطلوبة:
1. `model.json` — هيكل النموذج (model topology + weights manifest)
2. `metadata.json` — معلومات النموذج وأسماء الفئات (تم إضافته)
3. `weights.bin` — أوزان النموذج (ملف ثنائي)

## كيفية إضافة الملفات الناقصة:
1. من Teachable Machine، اضغط "Export Model" ثم "Download"
2. استخرج ملفات `model.json` و `weights.bin` من المجلد المحمّل
3. ضعهما في هذا المجلد (`public/tm-model/`)

## الفئات:
- النخيل
- البحار
- الجبال
- الصحراء
