#!/bin/bash

# تثبيت اعتماديات المشروع
yarn install

# استخراج وبناء ملفات البروتو
yarn gows:proto

# بناء المشروع
yarn build

echo "تم بناء المشروع بنجاح!" 