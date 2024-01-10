<template>
  <q-dialog :model-value="props.modal" persistent>
    <q-card style="min-width: 350px">
      <q-tab-panels v-model="tab" animated class="full-width">
        <q-tab-panel name="image">
          <q-img
            :src="props.data.image"
            :fit="'cover'"
            width="100%"
            height="300px"
          />
        </q-tab-panel>

        <q-tab-panel name="map"> Map Part </q-tab-panel>
      </q-tab-panels>
      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="place"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)"
          @click="changeTab()"
        />
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            {{ props.data.title }}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">
          {{ props.data.username }}
        </div>
        <div class="text-caption text-grey">
          {{ props.data.description.substring(0, 200) }} ...
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          color="light-blue-8"
          icon-right="close"
          label="Cancel"
          @click="close"
        />
        <q-btn
          color="red"
          icon-right="delete"
          label="Remove"
          @click="accepted"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
});

const tab = ref('image');
const changeTab = () => {
  if (tab.value == 'image') tab.value = 'map';
  else tab.value = 'image';
};

const emit = defineEmits(['update:modal']);

const close = () => {
  emit.call(this, 'update:modal', false);
};

const accepted = () => {
  emit.call(this, 'update:modal', false);
};
</script>
