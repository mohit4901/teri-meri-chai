// components/customisationOptions.js
export const pizzaCustomisations = [
  {
    title: "Extra Dip",
    type: "checkbox",
    options: [
      { label: "White Cheese", price: 20 },
      { label: "Mayo", price: 20 },
      { label: "Tandoori", price: 30 },
      { label: "Chilli Garlic", price: 30 },
    ],
  },
  {
    title: "Extra Cheese",
    type: "radio",
    options: [
      { label: "Small Pizza", price: 15 },
      { label: "Medium Pizza", price: 20 },
      { label: "Large Pizza", price: 30 },
    ],
  },
  {
    title: "Thin Crust",
    type: "radio",
    options: [
      { label: "Small Pizza", price: 10 },
      { label: "Medium Pizza", price: 15 },
      { label: "Large Pizza", price: 30 },
    ],
  },
  {
    title: "Extra Single Topping",
    type: "radio",
    options: [
      { label: "Small Pizza", price: 10 },
      { label: "Medium Pizza", price: 15 },
      { label: "Large Pizza", price: 30 },
    ],
  },
];
