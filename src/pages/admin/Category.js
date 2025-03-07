import React from "react";
import AddCategory from '../../components/admin/AddCategory';
import CategoryList from '../../components/admin/CategoryList';
const Category = () => {
  return (
    <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* <div className="flex flex-wrap flex-col gap-y-6"> */}
          <div className="w-full grid grid-cols-3 gap-10">
            <div className="w-full col-span-1">
              <AddCategory />
            </div>
            <div className="w-full col-span-2">
              <CategoryList />
            </div>
          </div>
          {/* </div> */}
      </div>
    </div>
  );
};

export default Category;
