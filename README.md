# پیاده سازی و ساخت Component Maplibre

###### برای استفاده از maplibre باید ابتدا عمل نصب آن را انجام دهیم. برای این کار قطعه دستور زیر را در ترمینال پروژه می زنیم.

```bash
npm install maplibre-gl
```

###### برای اینکه از یک API رایگان نقشه های موجود مبتنی بر maplibre بخواهید استفاده کنید، می توانید در سایت <a href="https://cloud.maptiler.com/">maptiler</a> ثبت نام کنید و یک key دریافت کنید. سپس بعد آن نوبت آن است که یک component بسازیم تا بعدا از آن استفاده کنیم، به همین منظور فایلی از نوع vue به نام MapView می سازیم.

###### ابتدا کلیه مواردی ک که در این فایل نیاز داریم را import می کنیم.
```bash
import { defineProps, defineEmits, ref, Ref, onMounted } from 'vue';
import maplibregl from 'maplibre-gl';
```
###### از کتابخانه vue ما defineProps و defineEmits و ref و Ref و onMounted را import می کنیم. از کتابخانه maplibre-gl هم maplibregl.

###### با بخشی از مواردی که import کرده ایم ، آشنا اید اما در مورد موارد جدید. maplibregl که برای ساختن object نقشه است. یک Ref داریم که R آن بزرگ است. در واقع Type است که نوع متغیر های ref را مشخص می کند. onMounted هم تابعی است توسط آن در کد ها می توانیم بگوییم، بعد از آن که کد اجرا شد یا به عبارتی وقتی کد ما بر روی کار نصب شد، حال شروع به اقدام کار هایی که می گوییم بکن. حال بریم برای ادامه کا.

###### برای کار خود نیاز است که props تعریف کنیم. از همین رو کد زیر را می نویسیم.

```bash
const props = defineProps({
  latitude: {
    default: <number> 37.28,
  },
  longitude: {
    default: <number> 49.6,
  },
  state: {
    default: <string> 'fixed',
  },
});
```

###### در props ما برای تگ component مقدار طول و عرض جغرافیایی و نیز وضعیت درخواست را مشخص می کنیم. state برای آن است که اگر fixed بود marker را ثابت نگه داریم و اگر move بود برای حالت های create و update اجازه حرکت و انتخاب موقعیت جغرافیایی را بدهیم.

###### در این مرحله ما متغیر های اولیه ای که نیاز داریم را می سازیم.
```bash
const latlong = ref({
  lat: <number>37.28,
  long: <number>49.6,
});

const emit = defineEmits(['update:latitude', 'update:longitude']);
```
###### یک متغیر برای نگه داری طول و عرض جغرافیایی و دیگری emit تعریف می کنیم برای طول و عرض جغرافیایی که وقتی بروز شدند، به لایه بالاتر نتیجه را منعکس کنیم.

###### حال برای کار خود نیاز داریم یک تابعی بسازیم که بتوانیم با صدا زدن آن یک object نقشه تولید کنیم.

```bash
function createMapObject(
  mapRef: Ref,
  defaultCoordinated: maplibregl.LngLatLike = [props.longitude, props.latitude]
) {
  const mapObject = new maplibregl.Map({
    container: mapRef.value,
    style:
      'https://api.maptiler.com/maps/basic-v2/style.json?key=0FJnvcFKNy5Bx3rGMA6R', // stylesheet location
    center: defaultCoordinated, // starting position [lng, lat]
    zoom: 9, // starting zoom
  });
  mapObject.addControl(new maplibregl.NavigationControl({}));
  return mapObject;
}
```

###### تابع createMapObject دو پارامتر دارد که اولی mapRef است که تایپ آن را Ref می گذاریم و دومی مختصاتی است که نیاز داریم تا مکان load شدن نقشه را تعیین کنیم. defaultCoordinated هم از maplibregl تایپ LngLatLike به آن نسبت می دهیم و به محض صدا شدن تابع یک لیست با مقادیر طول و عرض جغرافیایی وارد تابع می کنیم که آن را هم از روی props می خوانیم. در تابع متغیری می سازیم که سر آخر آن را باز می گردانیم و این متغیر در خود یک object نقشه از maplibregl را در خود جای داده است. در این object مقدار container را برابر با mapRef.value می گذاریم و style را برابر با API Key که از سایت گرفتیم و center که مرکز load شدن نقشه است را برابر با پارامتر defaultCoordinated می گذاریم و zoom شروع را برابر با 9 قرار می دهیم.

###### برای اینکه روی نقشه یک marker نمایش دهیم. تابع آن را درست می کنیم تا متناسب با نیاز ما یک marker ساخته شود.

```bash
function createMarker(coordinates: maplibregl.LngLatLike) {
  if (props.state == 'move') {
    const marker = new maplibregl.Marker({
      color: '#000000',
      draggable: true,
    }).setLngLat(coordinates);
    return marker;
  } else {
    const marker = new maplibregl.Marker({
      color: '#000000',
      draggable: false,
    }).setLngLat(coordinates);
    return marker;
  }
}
```

###### موقعی که تابع صدا زده می شود، ما یک پارامتر به نام coordinates دریافت می کنیم که از نوع LngLatLike است که قبلا در تابع createMapObject از آن استفاده کردیم. در ساخت marker ما دو وضعیت داریم، یکی اینکه اجازه حرکت دهیم که اگر state برابر با move بود این عمل را صورت می دهیم، در غیر این صورت ثابت نگه می داریم. در هر دو حالت یک متغیر marker می سازیم که یک object از نوع marker را از maplibregl می سازیم و به آن رنگ و متناسب با وضعیت اجازه حرکت کردن را تعیین می کنیم و در انتها روی آن مختصات  تنظیم می کنیم که کجا به نمایش در آید و سر انجام marker را باز می گردانیم.

###### حال زمانی که component اجرا شد، ما لازم داریم تا از تابع های خود استفاده کنیم تا هم نقشه را بسازیم و هم marker را بر روی آن قرار دهیم و هم اجازه drag شدن را به آن بدهیم.

```bash
const mapRef = ref();

onMounted(() => {
  const map = createMapObject(mapRef);
  const marker = createMarker([props.longitude, props.latitude]);
  marker.addTo(map);
  const onDragEnd = () => {
    const lngLat = marker.getLngLat();
    latlong.value.lat = lngLat.lat;
    latlong.value.long = lngLat.lng;
    emit.call(this, 'update:latitude', latlong.value.lat);
    emit.call(this, 'update:longitude', latlong.value.long);
  };
  marker.on('dragend', onDragEnd);
});
```

###### به این منظور ابتدا متغیری می سازیم از نوع Ref و بعد تابع onMounted را اجرا می کنیم.در تابع متغیر map را می سازیم و آن را با اجرا تابع createMapObject پر می کنیم که متغیر mapRef را به آن به عنوان پارامتر می دهیم. سپس متغیر marker را می سازیم و آن را با تابع createMarker پر می کنیم و پارامتر آن را با آرایه ای متشکل از طول و عرض جغرافیایی که در props است، پر می کنیم. در مرحله بعدی marker را به نقشه اضافه می کنیم.

###### حال تابعی درست می کنیم که در آن برای وضعیت پایان drag برنامه ریزی می کنیم که نام آن را onDragEnd گذاشتیم. در این تابع ما ابتدا مقدار طول و عرض جغرافیایی ای که marker وجود دارد را می گیریم و سپس آن را در متغیر latlong ذخیره می کنیم و به وسیله emit با لایه بالا تر اطلاع  می دهیم و سر انجام marker را بر روی نقطه ای که مورد نظر است drag می کنیم.

###### تمام موارد فوق را در تگ script می نویسیم.

```bash
<script lang="ts" setup>

</script>
```

###### در بخش template به صورت زیر عمل می کنیم

```bash
<template>
  <div ref="mapRef" class="map"></div>
</template>
```

###### در تگی که می خواهیم نقشه را اجرا کنیم، به آن props ref می دهیم و آن را برابر با متغیر mapRef خود در نظر می گیریم.

###### برای نقشه ای که اجرا می کنیم، نیاز به css داریم، از همین رو style زیر را هم به کد های خود اضافه می کنیم.

```bash
<style>
@import 'https://unpkg.com/maplibre-gl@2.1.9/dist/maplibre-gl.css';

.map {
  height: 200px;
  position: relative;
}
</style>
```



