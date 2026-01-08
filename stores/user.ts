import { defineStore } from 'pinia';
import { ref } from 'vue';
// 修正引用路徑 (使用 ~)
import { useApi } from '~/composables/useApi';

// 根據 Swagger 定義資料結構
export interface User {
  id?: number;
  name: string;
  age: number;
}

// 定義後端回傳的標準格式 (Swagger: main.Response)
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const api = useApi();

  // 1. 修正路徑：basePath(/api) + path(/user) = /api/user
  const API_PATH = '/api/user';

  const fetchUsers = async () => {
    try {
      // GET /api/user
      // 注意：Axios 回傳的 res.data 是 HTTP Body，
      // 但後端又包了一層 { code, message, data: [] }
      const res = await api.get<ApiResponse<User[]>>(API_PATH);
      
      // 這裡要取 res.data.data 才能拿到陣列
      if (res.data && Array.isArray(res.data.data)) {
        users.value = res.data.data;
      }
    } catch (error) {
      console.error('Fetch users failed', error);
    }
  };

  const addUser = async (user: User) => {
    // POST /api/user (Body: {name, age})
    await api.post(API_PATH, {
      name: user.name,
      age: user.age
    });
    await fetchUsers();
  };

  const updateUser = async (user: User) => {
    // PUT /api/user (Body: {id, name, age})
    // 根據 Swagger，ID 必須包含在 Body 裡面
    await api.put(API_PATH, {
        id: user.id,
        name: user.name,
        age: user.age
    });
    await fetchUsers();
  };

  const deleteUser = async (id: number) => {
    // DELETE /api/user
    // 陷阱：Swagger 定義 delete 的參數在 "body" 中 (main.deleteUserInfoReq)
    // Axios 的 delete 預設不帶 body，必須用 { data: ... } 的格式傳送
    await api.delete(API_PATH, {
      data: { id: id } 
    });
    
    await fetchUsers();
  };

  return { users, fetchUsers, addUser, updateUser, deleteUser };
});