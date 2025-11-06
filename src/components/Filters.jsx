// The filters shown on the starship listings page

import Tag from "@/src/components/Tag.jsx";

function FilterSelect({ label, options, value, onChange, name, icon }) {
  return (
    <div>
      <img src={icon} alt={label} />
      <label>
        {label}
        <select value={value} onChange={onChange} name={name}>
          {options.map((option, index) => (
            <option value={option} key={index}>
              {option === "" ? "All" : option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default function Filters({ filters, setFilters }) {
  const handleSelectionChange = (event, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: event.target.value,
    }));
  };

  const updateField = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };

  return (
    <section className="filter">
      <details className="filter-menu">
        <summary>
          <img src="/filter.svg" alt="filter" />
          <div>
            <p>Starships</p>
            <p>Sorted by {filters.sort || "Rating"}</p>
          </div>
        </summary>

        <form
          method="GET"
          onSubmit={(event) => {
            event.preventDefault();
            event.target.parentNode.removeAttribute("open");
          }}
        >
          <FilterSelect
            label="Starship Class"
            options={[
              "",
              "Cruiser",
              "Destroyer",
              "Freighter",
              "Fighter",
              "Dreadnought",
              "Scout",
              "Carrier",
              "Explorer",
              "Battleship",
              "Corvette",
              "Frigate",
              "Interceptor",
              "Transport",
              "Research Vessel",
            ]}
            value={filters.shipclass}
            onChange={(event) => handleSelectionChange(event, "shipclass")}
            name="shipclass"
            icon="/starship-class.svg"
          />

          <FilterSelect
            label="Manufacturer"
            options={[
              "",
              "Weyland-Yutani Corp",
              "Tyrell Industries",
              "Starfleet",
              "Martian Congressional Republic",
              "Blue Sun Corporation",
              "Cerberus",
              "Nerv",
              "InGen",
              "Umbrella Corporation",
              "Aperture Science",
              "Vault-Tec",
              "Hyperion Corporation",
              "Encom",
              "Omni Consumer Products",
              "Genetics General",
              "Stellar Dynamics",
              "Quantum Shipyards",
              "Nova Industries",
              "Titan Fleetworks",
              "Orbital Manufacturing",
            ]}
            value={filters.manufacturer}
            onChange={(event) => handleSelectionChange(event, "manufacturer")}
            name="manufacturer"
            icon="/manufacturer.svg"
          />

          <FilterSelect
            label="Production Cost"
            options={["", "₡", "₡₡", "₡₡₡", "₡₡₡₡"]}
            value={filters.price}
            onChange={(event) => handleSelectionChange(event, "price")}
            name="price"
            icon="/price.svg"
          />

          <FilterSelect
            label="Sort"
            options={["Rating", "Review"]}
            value={filters.sort}
            onChange={(event) => handleSelectionChange(event, "sort")}
            name="sort"
            icon="/sortBy.svg"
          />

          <footer>
            <menu>
              <button
                className="button--cancel"
                type="reset"
                onClick={() => {
                  setFilters({
                    manufacturer: "",
                    shipclass: "",
                    price: "",
                    sort: "",
                  });
                }}
              >
                Reset
              </button>
              <button type="submit" className="button--confirm">
                Submit
              </button>
            </menu>
          </footer>
        </form>
      </details>

      <div className="tags">
        {Object.entries(filters).map(([type, value]) => {
          // The main filter bar already specifies what
          // sorting is being used. So skip showing the
          // sorting as a 'tag'
          if (type == "sort" || value == "") {
            return null;
          }
          return (
            <Tag
              key={value}
              type={type}
              value={value}
              updateField={updateField}
            />
          );
        })}
      </div>
    </section>
  );
}
