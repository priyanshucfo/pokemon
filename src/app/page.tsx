"use client";

import { useEffect, useState, lazy } from "react";
import Loader from "@/components/Loader";

const Card = lazy(() => import("@/components/Card"));

const Home = () => {
  const [allPokemons, setAllPokemons] = useState<{ name: string; url: string }[]>([]);
  const [displayedPokemons, setDisplayedPokemons] = useState<{ name: string; url: string }[]>([]);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPokemons(0);
  }, []);

  const fetchAllPokemons = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
      if (!res.ok) throw new Error("Failed to fetch Pokemon list");
      const data = await res.json();
      setAllPokemons(data.results);
    } catch (error) {
      console.error("Error fetching all Pokemon:", error);
    }
  };

  const fetchPokemons = async (newoffset = offset) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${newoffset}`
      );
      if (!res.ok) throw new Error("Failed to fetch Pokemon batch");
      
      const data = await res.json();
      setDisplayedPokemons((prev) => [...prev, ...data.results]);
      setOffset(newoffset + 20);

      if (data.results.length < 20) setHasMore(false);
      if (allPokemons.length === 0) fetchAllPokemons();
    } catch (error) {
      console.error("Error fetching Pokemon batch:", error);
    }
    setLoading(false);
  };

  const filteredPokemons = search
    ? allPokemons.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : displayedPokemons;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon, index) => (
            <Card key={index} name={pokemon.name} index={index + offset + 1} />
          ))
        ) : (
          <p className="text-center col-span-4 text-gray-500">No Pokemon Found</p>
        )}
      </div>

      {hasMore && !search && (
        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all"
            onClick={() => fetchPokemons(offset)}
            disabled={loading}
          >
            {loading ? <Loader /> : "View More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
