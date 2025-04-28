export const filterCarsByBrand = (cars, brand) => {
    return cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
  };
  
  export const filterCarsByPriceRange = (cars, minPrice, maxPrice) => {
    return cars.filter(car => 
      car.price >= minPrice && car.price <= maxPrice
    );
  };
  
  export const sortCarsByPrice = (cars, ascending = true) => {
    return [...cars].sort((a, b) => 
      ascending ? a.price - b.price : b.price - a.price
    );
  };