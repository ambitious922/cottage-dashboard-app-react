import {  IngredientUnit } from 'API';
import { MAX_DOLLARS } from 'constants/index';
import * as Yup from 'yup';

export const IngredientUnitValues = [
  { name: '', value: undefined },
  { name: 'lb', value: IngredientUnit.POUND },
  { name: 'oz', value: IngredientUnit.OUNCE },
  { name: 'mg', value: IngredientUnit.MILLIGRAM },
  { name: 'g', value: IngredientUnit.GRAM },
  { name: 'tsp', value: IngredientUnit.TEASPOON },
  { name: 'tbsp', value: IngredientUnit.TABLESPOON },
  { name: 'fl oz', value: IngredientUnit.FLUID_OUNCE },
  { name: 'cup', value: IngredientUnit.CUP },
  { name: 'pt', value: IngredientUnit.PINT },
  { name: 'qt', value: IngredientUnit.QUART },
  { name: 'gal', value: IngredientUnit.GALLON },
  { name: 'mL', value: IngredientUnit.MILLILITER },
];

// Undefined fields are optional
export interface IProductFormValues {
  title: string;
  price: number | undefined;
  description: string | undefined | null;
  categories: string[] | undefined | null;
  tags: string[] | undefined | null;
  images?: Map<string, string>;
  ingredients: {
    name?: string | null | undefined
    value?: number | null | undefined
    unit?: string | null | undefined
  }[],
    nutrition: {
    calorie?: number | undefined | null;
    carbohydrate?: number | undefined | null;
    protein?: number | undefined | null;
    fat?: number | undefined | null;
  } |  undefined | null;
}

export const ProductFormFieldValues: IProductFormValues = {
  title: '',
  price: undefined,
  description: '',
  categories: [],
  tags: [],
  ingredients: [],
  nutrition: {
    calorie: undefined,
    carbohydrate: undefined,
    protein: undefined,
    fat: undefined,
  },
  images: new Map<string,string>(),
};

const ingredientShape = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, "Name can't be less than 2 characters")
    .max(20, "Name can't be greater than 20 characters"),
  value: Yup.number()
    .notRequired()
    .nullable()
    .min(0, "Value can't be negative")
    .max(10000, "Value is too large"),
  unit: Yup.mixed()
    .notRequired()
    .nullable()
    .oneOf([...Object.values(IngredientUnit), null]),
});

export const ProductFormValidation = Yup.object().shape({
  title: Yup.string()
    .required('Item name is requried')
    .min(3, "Item name can't be shorter than 3 characters")
    .max(60, "Item name can't be greater than 60 characters"),
  price: Yup.number()
    .required('Price is required')
    .moreThan(0, "Price is too low")
    .max(MAX_DOLLARS, "Price is too high"),
  description: Yup.string()
    .notRequired()
    .nullable()
    .min(0)
    .max(250, 'Description cannot be greater than 250 characters'),
  ingredients: Yup.array()
    .of(ingredientShape)
    .notRequired()
    .max(20, "Can't have more than 20 ingredients"),
  tags: Yup.array()
    .of(Yup.string())
    .notRequired(),
  categories: Yup.array()
    .of(Yup.string())
    .notRequired(),
  nutrition: Yup.object().shape({
    protein: Yup.number()
    .nullable()
    .notRequired()
    .min(0, 'Protein cannot be negative')
    .max(10000, 'Protein cannot be greater than 10000'),
    calorie: Yup.number()
      .nullable()
      .notRequired()
      .min(0, 'Calorie cannot be negative')
      .max(10000, 'Calorie cannot be greater than 10000'),
    carbohydrate: Yup.number()
      .nullable()
      .notRequired()
      .min(0, 'Carbohydrate cannot be negative')
      .max(10000, 'Carbohydrate cannot be greater than 10000'),
    fat: Yup.number()
      .nullable()
      .notRequired()
      .min(0, 'Fat cannot be negative')
      .max(10000, 'Fat cannot be greater than 10000')
    })
  });