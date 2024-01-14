<template>
  <q-layout class="overflow-auto window-height">
    <div class="q-pa-md q-mb-xl row items-start q-gutter-sm justify-center">
      <q-card class="my-card" v-for="(post, index) in posts" :key="index">
        <q-img :src="post.image" width="100%" height="300px" />
        <q-card-section>
          <q-btn
            fab
            color="light-blue-8"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
            @click="fullMap(post.latitude, post.longitude)"
          />
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ post.title }}
            </div>
            <div
              class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
            ></div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            {{ post.username }}
          </div>
          <div class="text-caption text-grey">
            {{ post.description.substring(0, 200) }} ...
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-btn
            color="light-blue-8"
            icon-right="favorite"
            :label="`Like (${post.upVoteCount})`"
            @click="like(post.id)"
          />
        </q-card-actions>
      </q-card>
      <div class="q-gutter-md q-pa-lg">
        <q-pagination
          class="d-flex justify-center"
          v-model="pagination.current_page"
          :max="pagination.last_page"
          direction-links
          push
          color="primary"
          active-design="push"
          active-color="orange"
          :max-pages="7"
          @update:model-value="refresh"
        />
      </div>
    </div>
  </q-layout>
  <q-dialog
    v-model="mapParameter.maximize"
    persistent
    :maximized="mapParameter.maximize"
  >
    <q-card class="bg-primary text-white">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup></q-btn>
      </q-bar>
      <MapView
        class="full-width full-height"
        :latitude="mapParameter.lat"
        :longitude="mapParameter.long"
      ></MapView>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { posts, refresh, pagination } from 'components/ts/IndexComponent';
import { ref } from 'vue';
import MapView from 'components/vue/MapView.vue';

const like = (id: number) => {
  console.log(id);
};

refresh();

const mapParameter = ref({
  lat: <number>0,
  long: <number>0,
  maximize: <boolean>false,
});

const fullMap = (lat: number, long: number) => {
  mapParameter.value.lat = lat;
  mapParameter.value.long = long;
  mapParameter.value.maximize = true;
};
</script>
