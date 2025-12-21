import { useState } from "react";
import { pizzaCustomisations } from "./customisationOptions";

const ProductCustomizationModal = ({ product, onClose, onConfirm }) => {
  const [selected, setSelected] = useState({});
  const [note, setNote] = useState("");

  const handleSelect = (group, option, type) => {
    setSelected((prev) => {
      if (type === "checkbox") {
        const arr = prev[group] || [];
        const exists = arr.find((o) => o.label === option.label);
        return {
          ...prev,
          [group]: exists
            ? arr.filter((o) => o.label !== option.label)
            : [...arr, option],
        };
      }

      return {
        ...prev,
        [group]: option,
      };
    });
  };

  const calculateExtra = () => {
    let total = 0;
    Object.values(selected).forEach((v) => {
      if (Array.isArray(v)) {
        v.forEach((o) => (total += o.price));
      } else {
        total += v.price;
      }
    });
    return total;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl p-4 max-h-[90vh] overflow-y-auto">
        
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-500 text-sm mb-4">
          Base Price: ₹{product.price}
        </p>

        {pizzaCustomisations.map((group) => (
          <div key={group.title} className="mb-4">
            <h3 className="font-semibold mb-2">{group.title}</h3>

            {group.options.map((opt) => {
              const checked =
                group.type === "checkbox"
                  ? selected[group.title]?.some(
                      (o) => o.label === opt.label
                    )
                  : selected[group.title]?.label === opt.label;

              return (
                <label
                  key={opt.label}
                  className="flex items-center justify-between border rounded px-3 py-2 mb-2 cursor-pointer"
                >
                  <span>
                    {opt.label}
                    <span className="text-sm text-gray-500">
                      {" "}
                      (+₹{opt.price})
                    </span>
                  </span>

                  <input
                    type={group.type}
                    checked={checked}
                    onChange={() =>
                      handleSelect(group.title, opt, group.type)
                    }
                  />
                </label>
              );
            })}
          </div>
        ))}

        <textarea
          placeholder="Any special note? (optional)"
          className="w-full border rounded p-2 mb-4"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-between items-center font-semibold mb-4">
          <span>Total</span>
          <span>
            ₹{product.price + calculateExtra()}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border rounded py-2"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm({
                product,
                customisations: selected,
                note,
                extraPrice: calculateExtra(),
              })
            }
            className="flex-1 bg-red-500 text-white rounded py-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizationModal;
