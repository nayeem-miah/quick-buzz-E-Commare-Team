import React from 'react';
import Container from '../../../Shared/Navbar/Container';
import { categories } from './CategoryData';
import CategoryBox from './CategoryBox';


const Categories: React.FC = () => {
  return (
    <Container>
      <div className="pt-4 flex  gap-1 items-center justify-between overflow-x-auto border">
        {categories.map((item) => (
          <CategoryBox key={item.label} label={item.label} icon={item.icon} />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
