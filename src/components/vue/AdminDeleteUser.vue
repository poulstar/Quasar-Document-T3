<template>
  <q-dialog :model-value="props.modal" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="person" color="primary" text-color="white" />
        <span class="q-ml-sm"
          >Are You Sure, Want You To Delete {{ props.data.name }}?</span
        >
      </q-card-section>

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
          label="Delete"
          @click="accepted"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { User } from 'src/models/user';

const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
  refresh: {},
});

const emit = defineEmits(['update:modal']);

const close = () => {
  emit.call(this, 'update:modal', false);
};
const accepted = () => {
  User.deleteUserByAdmin(props.data.id).then(
    (response) => {
      if (response.status == 200) {
        props.refresh();
        emit.call(this, 'update:modal', false);
      }
    },
    (reject) => {
      if (reject.response.status != 200) {
        if (reject.response.data.errors) {
          console.log(reject.response.data.errors);
        }
      }
    }
  );
};
</script>
