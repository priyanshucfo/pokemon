"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { VscClose } from "react-icons/vsc";

const Navbar = ({ setSearch }: { setSearch?: (value: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ name: string; id: number; sprite: string }[]>([]);
  const [allPokemons, setAllPokemons] = useState<{ name: string; id: number; sprite: string }[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cachedPokemons = sessionStorage.getItem("allPokemons");
    if (cachedPokemons) {
      setAllPokemons(JSON.parse(cachedPokemons));
    } else {
      fetchAllPokemons();
    }
  }, []);

  const fetchAllPokemons = async () => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
      if (!res.ok) throw new Error("Failed to fetch Pokemon");
      const data = await res.json();

      const formattedData = data.results.map((p: any, index: number) => ({
        name: p.name,
        id: index + 1,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
      }));

      setAllPokemons(formattedData);
      sessionStorage.setItem("allPokemons", JSON.stringify(formattedData));
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    }
  };

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);
      if (setSearch) setSearch(query);

      if (query.length > 0) {
        setSearchResults(
          allPokemons.filter((p) => p.name.toLowerCase().includes(query))
        );
      } else {
        setSearchResults([]);
      }
    },
    [allPokemons, setSearch]
  );

  const closeSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg text-lg relative">
      <div className="font-semibold text-xl cursor-pointer" onClick={() => router.push("/")}>
        Pookie
      </div>

      <div className="relative">
        {!isSearchOpen ? (
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 bg-white text-gray-600 rounded-full shadow-md"
            onClick={() => setIsSearchOpen(true)}
          >
            <CiSearch size={22} />
          </button>
        ) : (
          <div className="fixed top-0 left-0 w-screen h-screen bg-white z-50 flex flex-col">
            <div className="flex items-center px-4 py-3 bg-gray-200 shadow-md">
              <input
                type="text"
                placeholder="Search Pokemon..."
                className="h-12 flex-grow px-4 text-black border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleSearch}
                value={searchQuery}
                autoFocus
              />
              <button className="ml-4 text-2xl text-gray-600" onClick={closeSearch}>
                <VscClose />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              {searchResults.length > 0 ? (
                searchResults.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-300"
                    onClick={() => {
                      router.push(`/pokemon/${pokemon.id}`);
                      closeSearch();
                    }}
                  >
                    <img src={pokemon.sprite} alt={pokemon.name} className="w-12 h-12 rounded-lg mr-4" />
                    <span className="capitalize text-lg text-black font-medium">{pokemon.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-10">No Pokemon found</p>
              )}
            </div>
          </div>
        )}

        <div className="relative hidden md:block w-80">
          <input
            type="text"
            placeholder="Search Pokemon"
            className="h-10 w-full px-4 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchQuery}
          />
          <button className="absolute right-3 top-2 text-2xl text-gray-500">
            <CiSearch />
          </button>

          {searchResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-white border border-gray-300 shadow-lg rounded-lg max-h-60 overflow-y-auto z-50">
              {searchResults.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/pokemon/${pokemon.id}`)}
                >
                  <img src={pokemon.sprite} alt={pokemon.name} className="w-12 h-12 rounded-lg mr-4" />
                  <span className="capitalize text-lg text-black font-medium">{pokemon.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
