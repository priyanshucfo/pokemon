"use client";

import { useEffect, useState, Suspense, lazy } from "react";
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
    fetchAllPokemons(); 
    fetchPokemons(); 
  }, []);

  const fetchAllPokemons = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`); 
    const data = await res.json();
    setAllPokemons(data.results);
  };

  const fetchPokemons = async (newoffset = offset) => {
    setLoading(true);
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${newoffset}`
    );
    const data = await res.json();

    setDisplayedPokemons((prev) => [...prev, ...data.results]);
    setOffset(newoffset + 20);
    if (data.results.length < 20) setHasMore(false);
    setLoading(false);
  };

  const filteredPokemons = search
    ? allPokemons.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : displayedPokemons;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        <Suspense fallback={<Loader />}>
          {filteredPokemons.length > 0 ? (
            filteredPokemons.map((pokemon, index) => (
              <Card key={index} name={pokemon.name} index={index + 1} />
            ))
          ) : (
            <p className="text-center col-span-4 text-gray-500">No Pookie Found</p>
          )}
        </Suspense>
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
