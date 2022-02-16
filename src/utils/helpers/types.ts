// deno-lint-ignore-file ban-types no-explicit-any

/** Include property keys from T where the property is assignable to U */
export type IncludePropertyKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];
/** Excludes property keys from T where the property is assignable to U */
export type ExcludePropertyKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? never : P;
}[keyof T];

/** Includes properties from T where the property is assignable to U */
export type IncludePropertyTypes<T, U> = {
  [K in IncludePropertyKeys<T, U>]: T[K];
};
/** Excludes properties from T where the property is assignable to U */
export type ExcludePropertyTypes<T, U> = {
  [K in ExcludePropertyKeys<T, U>]: T[K];
};

/** Makes properties of type T optional where the property is assignable to U */
export type OptionalPropertyType<T, U> =
  & ExcludePropertyTypes<T, U>
  & Partial<IncludePropertyTypes<T, U>>;
/** Makes properties of type T readonly where the property is assignable to U */
export type ReadonlyPropertyType<T, U> =
  & ExcludePropertyTypes<T, U>
  & Readonly<IncludePropertyTypes<T, U>>;

// Helper type
export type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A
    : B;

// Type that defines a constructable class
export type Constructable<T> =
  & (new (...args: any[]) => object)
  & (new (...args: any[]) => T);

// Excludes readonly fields of type T
export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

// Excludes writeable fields from type T (only ReadOnly fields will be visible)
export type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    never,
    P
  >;
}[keyof T];
