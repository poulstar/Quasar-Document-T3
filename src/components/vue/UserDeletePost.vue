<template>
  <q-dialog :model-value="props.modal" persistent>
    <q-card style="min-width: 350px">
      <q-banner
        inline-actions
        rounded
        class="bg-warning text-white"
        v-show="preSendingMessage"
      >
        Your request is being sent
      </q-banner>
      <q-banner
        inline-actions
        rounded
        class="bg-positive text-white"
        v-show="doneMessage"
      >
        {{ doneMessageText }}
      </q-banner>
      <q-banner
        inline-actions
        rounded
        class="bg-negative text-white"
        v-show="errorMessage"
      >
        {{ errorMessageText }}
      </q-banner>
      <q-tab-panels v-model="tab" animated class="full-width">
        <q-tab-panel name="image">
          <q-img
            :src="props.data.image"
            :fit="'cover'"
            width="100%"
            height="300px"
          />
        </q-tab-panel>

        <q-tab-panel name="map">
          <MapView
            :latitude="props.data.latitude"
            :longitude="props.data.longitude"
          ></MapView>
        </q-tab-panel>
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
import { Post } from 'src/models/post';
import MapView from 'components/vue/MapView.vue';

const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
  refresh: {},
});

const preSendingMessage = ref(false);
const doneMessage = ref(false);
const doneMessageText = ref('');
const errorMessage = ref(false);
const errorMessageText = ref('');

const tab = ref('image');
const changeTab = () => {
  if (tab.value == 'image') tab.value = 'map';
  else tab.value = 'image';
};

const emit = defineEmits(['update:modal']);

const close = () => {
  preSendingMessage.value = false;
  doneMessage.value = false;
  doneMessageText.value = '';
  errorMessage.value = false;
  errorMessageText.value = '';
  emit.call(this, 'update:modal', false);
};

const accepted = () => {
  preSendingMessage.value = true;
  Post.deletePost(props.data.id).then(
    (response) => {
      if (response.status == 200) {
        preSendingMessage.value = false;
        props.refresh();
        if (response.data.errors) {
          doneMessage.value = true;
          doneMessageText.value = response.data.errors.error[0];
          setTimeout(() => {
            doneMessage.value = false;
            emit.call(this, 'update:modal', false);
          }, 3000);
        }
      }
    },
    (reject) => {
      if (reject.response.status != 200) {
        if (reject.response.data.errors) {
          preSendingMessage.value = false;
          errorMessage.value = true;
          errorMessageText.value = reject.response.data.errors.error[0];
          setTimeout(() => {
            errorMessage.value = false;
          }, 5000);
        }
      }
    }
  );
};
</script>
