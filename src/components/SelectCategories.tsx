import { Category } from "../interfaces/category"

interface SelectCategoriesProps {
  categories: Category[];
  onSelectOptionChange: React.ChangeEventHandler<HTMLSelectElement>
  selectedCat: string;
}

export default function SelectCategories({categories, onSelectOptionChange, selectedCat}: SelectCategoriesProps) {
    return (
        <select className="flex-1 p-2 rounded-lg border border-slate-200" name="categorySelect" id="categorySelect" value={selectedCat} onChange={onSelectOptionChange}>
        <option value="">Please choose a category</option>
        {categories && categories.map(cat => (
          <option value={cat.name} key={cat.id}>{cat.name[0].toUpperCase() + cat.name.slice(1)}</option>
        ))}
      </select>
    )
}