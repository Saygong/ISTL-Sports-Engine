import { BrowserRouter } from "react-router";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";
import "./App.css";
import { AppRoutes } from "./AppRoutes.tsx";
import { AuthProvider, getHeaders } from "./contexts/AuthContext.tsx";

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:3000/graphql";
console.log("graphqlUrl", graphqlUrl)

const client = new Client({
  url: graphqlUrl,
  exchanges: [cacheExchange, fetchExchange],
  preferGetMethod: false,
  fetchOptions: () => {
    const headers = getHeaders();
    return {
      headers,
    };
  },
});

function App() {
  return (
    <Provider value={client}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
