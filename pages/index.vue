<template>
  <div class="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
    
    <div class="w-full max-w-4xl flex justify-end mb-4">
      <select 
        v-model="locale" 
        class="bg-gray-700 text-white p-2 rounded border border-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
      >
        <option 
          v-for="item in locales" 
          :key="item?.code" 
          :value="item?.code"
        >
          {{ item?.name }}
        </option>
      </select>
    </div>

    <section class="w-full max-w-4xl border border-gray-600 rounded-xl p-6 md:p-8 mb-8 relative bg-gray-900/50">
      <h2 class="text-center text-xl font-bold mb-6 absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 px-4 whitespace-nowrap">
        {{ $t('operation') }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-2">
        <ETextField 
          v-model:value="formData.name" 
          :label="$t('name')" 
          placeholder="abc1234" 
        />
        <ETextField 
          v-model:value="formData.age" 
          :label="$t('age')" 
          type="number" 
          placeholder="123" 
        />
      </div>

      <div class="flex justify-end gap-4">
        <EBtn variant="primary" @click="handleConfirm('update')">{{ $t('modify') }}</EBtn>
        <EBtn variant="warning" @click="handleConfirm('add')">{{ $t('add') }}</EBtn>
      </div>
    </section>

    <section class="w-full max-w-4xl border border-gray-600 rounded-xl p-4 md:p-8">
      
      <div class="hidden md:grid grid-cols-4 text-center font-bold mb-4 border-b border-gray-700 pb-2">
        <div>#</div>
        <div>{{ $t('name') }}</div>
        <div>{{ $t('age') }}</div>
        <div>{{ $t('action') }}</div>
      </div>

      <div class="flex flex-col gap-4 md:block">
        <div 
          v-for="user in userStore.users" 
          :key="user.id" 
          class="
            border border-gray-700 rounded-lg p-4 bg-gray-800/30
            md:grid md:grid-cols-4 md:text-center md:py-3 md:border-0 md:border-b md:border-gray-800 md:bg-transparent md:items-center md:rounded-none
          "
        >
          <div class="flex justify-between md:block mb-2 md:mb-0">
            <span class="text-gray-400 font-bold md:hidden">ID:</span>
            <span>{{ user.id }}</span>
          </div>

          <div class="flex justify-between md:block mb-2 md:mb-0">
            <span class="text-gray-400 font-bold md:hidden">{{ $t('name') }}:</span>
            <span class="font-bold text-yellow-500 md:text-white md:font-normal">{{ user.name }}</span>
          </div>

          <div class="flex justify-between md:block mb-4 md:mb-0">
            <span class="text-gray-400 font-bold md:hidden">{{ $t('age') }}:</span>
            <span>{{ user.age }}</span>
          </div>

          <div class="flex justify-end gap-2 md:justify-center">
            <EBtn variant="primary" class="text-sm px-3 md:px-2" @click="selectUser(user)">{{ $t('modify') }}</EBtn>
            <EBtn variant="danger" class="text-sm px-3 md:px-2" @click="handleConfirm('delete', user)">{{ $t('delete') }}</EBtn>
          </div>
        </div>
      </div>
      
      <div v-if="userStore.users.length === 0" class="text-center text-gray-500 py-8">
        No Data
      </div>

    </section>

    <dialog ref="confirmDialog" class="bg-gray-800 text-white p-6 rounded-lg backdrop:bg-black/50 border border-gray-600 max-w-sm w-full">
      <h3 class="text-lg font-bold mb-4">{{ $t('confirm_action') }}</h3>
      <p class="mb-6 text-gray-300">{{ dialogMessage }}</p>
      <div class="flex justify-end gap-4">
        <EBtn @click="closeDialog">{{ $t('cancel') }}</EBtn>
        <EBtn variant="warning" @click="executeAction">{{ $t('confirm') }}</EBtn>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { useUserStore, type User } from '@/stores/user';
// 注意：不要 import { useI18n } from 'vue-i18n'，讓 Nuxt 自動引入
// import { useI18n } from 'vue-i18n'; 

const { t, locale, locales } = useI18n();
const userStore = useUserStore();

// SSR 獲取資料
await useAsyncData('users', async () => {
  await userStore.fetchUsers();
  return userStore.users;
});

// 表單資料
const formData = reactive({
  id: undefined as number | undefined,
  name: '',
  age: '' as string | number 
});

// Dialog 控制
const confirmDialog = ref<HTMLDialogElement | null>(null);
const actionType = ref<'add' | 'update' | 'delete' | null>(null);
const targetId = ref<number | null>(null);
const dialogMessage = ref('');

// 選擇用戶
const selectUser = (user: User) => {
  formData.id = user.id;
  formData.name = user.name;
  formData.age = user.age;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 驗證
const validate = () => {
  if (!formData.name || !formData.age) {
    alert(t('validation_error')); 
    return false;
  }
  return true;
};

// 觸發確認
const handleConfirm = (type: 'add' | 'update' | 'delete', user?: User) => {
  actionType.value = type;
  
  if (type === 'delete' && user) {
    targetId.value = user.id!;
    dialogMessage.value = `${t('confirm_delete')} ${user.name}?`;
  } else if (type === 'add') {
    if (!validate()) return;
    dialogMessage.value = t('confirm_add');
  } else if (type === 'update') {
    if (!formData.id || !validate()) return;
    dialogMessage.value = t('confirm_update');
  }

  confirmDialog.value?.showModal();
};

const closeDialog = () => {
  confirmDialog.value?.close();
};

const executeAction = async () => {
  try {
    if (actionType.value === 'add') {
      await userStore.addUser({ name: formData.name, age: Number(formData.age) });
    } else if (actionType.value === 'update') {
      await userStore.updateUser({ id: formData.id, name: formData.name, age: Number(formData.age) });
    } else if (actionType.value === 'delete' && targetId.value) {
      await userStore.deleteUser(targetId.value);
    }
    
    if (actionType.value !== 'delete') {
      formData.id = undefined;
      formData.name = '';
      formData.age = '';
    }
  } catch (e) {
    console.error(e);
  } finally {
    closeDialog();
  }
};
</script>

<style scoped>
dialog[open] {
  animation: fade-in 0.3s ease-out;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>