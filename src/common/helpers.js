import isPlainObject from "lodash/isPlainObject";
import mapKeys from "lodash/mapKeys";
import trim from "lodash/trim";

export function trimData(body){
  const trimValue = (item) => {
    mapKeys(item, (value, key) => {
      // trim string value
      if (typeof value === "string") {
        item[key] = trim(value);
      }

      // iterate array
      else if (Array.isArray(value)) {
        value.forEach((subValue, index) => {
          // trim string value
          if (typeof subValue === "string" && !trim(subValue)) {
            value[index] = trim(subValue);
          } else if (isPlainObject(subValue)) {
            trimValue(subValue);
          }
        });
      } else if (isPlainObject(value)) {
        trimValue(value);
      }
    });
  };

  trimValue(body);
}
