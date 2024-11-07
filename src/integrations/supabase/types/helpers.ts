import type { Database } from './database'

export type Tables<
  T extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends T extends { schema: keyof Database }
    ? keyof Database[T['schema']]['Tables']
    : never = never
> = T extends { schema: keyof Database }
  ? Database[T['schema']]['Tables'][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : T extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][T] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  T extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends T extends { schema: keyof Database }
    ? keyof Database[T['schema']]['Tables']
    : never = never
> = T extends { schema: keyof Database }
  ? Database[T['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : T extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][T] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  T extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends T extends { schema: keyof Database }
    ? keyof Database[T['schema']]['Tables']
    : never = never
> = T extends { schema: keyof Database }
  ? Database[T['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : T extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][T] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  T extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends T extends { schema: keyof Database }
    ? keyof Database[T['schema']]['Enums']
    : never = never
> = T extends { schema: keyof Database }
  ? Database[T['schema']]['Enums'][EnumName]
  : T extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][T]
  : never