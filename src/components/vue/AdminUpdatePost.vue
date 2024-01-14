<template>
  <q-dialog :model-value="props.modal" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Update Post</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model:model-value="updatePostParameter.title"
          label="Enter Your Title"
          ref="titleState"
          :error="titleError.length > 0"
          :error-message="titleError"
          :rules="[
            (val) => !!val || 'Required',
            (val) => val.length > 3 || 'Please use minimum 4 character',
            (val) => val.length <= 100 || 'Please use maximum 100 character',
          ]"
          lazy-rules
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          type="textarea"
          dense
          v-model:model-value="updatePostParameter.description"
          label="Enter Your Description"
          ref="descriptionState"
          :error="descriptionError.length > 0"
          :error-message="descriptionError"
          :rules="[
            (val) => !!val || 'Required',
            (val) => val.length > 3 || 'Please use minimum 4 character',
            (val) =>
              val.length <= 10000 || 'Please use maximum 10000 character',
          ]"
          lazy-rules
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-file
          filled
          bottom-slots
          v-model:model-value="updatePostParameter.image"
          label="Post Image"
          counter
          ref="imageState"
          :error="imageError.length > 0"
          :error-message="imageError"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="updatePostParameter.image = null"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:hint> File Size </template>
        </q-file>
      </q-card-section>
      <MapView
        v-model:latitude="updatePostParameter.latitude"
        v-model:longitude="updatePostParameter.longitude"
        :state="'move'"
      ></MapView>
      <q-card-actions align="right" class="text-primary">
        <q-btn color="red" icon-right="close" label="Cancel" @click="close" />
        <q-btn
          color="light-blue-8"
          icon-right="create"
          label="Create"
          @click="accepted"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { Post } from 'src/models/post';
import MapView from 'components/vue/MapView.vue';

const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
  refresh: {},
});

const titleError = ref('');
const descriptionError = ref('');
const imageError = ref('');

const titleState = ref(null);
const descriptionState = ref(null);
const imageState = ref(null);

const updatePostParameter = ref({
  id: 0,
  title: '',
  description: '',
  image: undefined,
  latitude: <number>37.28,
  longitude: <number>49.6,
});

watch(props, () => {
  updatePostParameter.value = {
    id: props.data.id,
    title: props.data.title,
    description: props.data.description,
    image: updatePostParameter.value.image,
    latitude: props.data.latitude,
    longitude: props.data.longitude,
  };
});

const emit = defineEmits(['update:modal']);

const close = () => {
  emit.call(this, 'update:modal', false);
};

const accepted = () => {
  titleState.value.validate();
  descriptionState.value.validate();

  if (titleState.value.hasError || descriptionState.value.hasError) {
    console.log('please Complete Form Data');
  } else {
    Post.adminUpdatePost(
      updatePostParameter.value.id,
      updatePostParameter.value.title,
      updatePostParameter.value.description,
      updatePostParameter.value.image,
      updatePostParameter.value.latitude,
      updatePostParameter.value.longitude
    ).then(
      (response) => {
        if (response.status == 200) {
          props.refresh();
          emit.call(this, 'update:modal', false);
        }
      },
      (reject) => {
        if (reject.response.status != 200) {
          if (reject.response.data.errors) {
            titleError.value =
              reject.response.data.errors?.title?.toString() ?? '';
            descriptionError.value =
              reject.response.data.errors?.description?.toString() ?? '';
            imageError.value =
              reject.response.data.errors?.image?.toString() ?? '';
            setTimeout(() => {
              titleError.value = '';
              descriptionError.value = '';
              imageError.value = '';
            }, 5000);
          }
        }
      }
    );
  }
};
</script>
