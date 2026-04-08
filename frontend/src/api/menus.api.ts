export interface MenuDTO {
  id?: number;
  entrada: string;
  plato_principal: string;
  postre: string;
  descripcion: string;
  precio: number;
  disponible: number;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = "http://localhost:3000/api/menus";

export const getMenus = async (): Promise<MenuDTO[]> => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching menus");
  }

  return response.json();
};

export const createMenu = async (menu: Partial<MenuDTO>): Promise<MenuDTO> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(menu),
  });

  if (!response.ok) {
    throw new Error("Error creating menu");
  }

  return response.json();
};

export const updateMenu = async (id: number, menu: Partial<MenuDTO>): Promise<MenuDTO> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(menu),
  });

  if (!response.ok) {
    throw new Error("Error updating menu");
  }

  return response.json();
};

export const deleteMenu = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error deleting menu");
  }
};
