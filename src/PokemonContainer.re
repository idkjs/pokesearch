module PokemonQuery = [%graphql
  {|
  query getPokemon($name: String!) {
    pokemon(name: $name) {
     id,
     name,
     weight,
     height,
     sprites {
       front_default,
       back_default,
       front_shiny,
       back_shiny
     },
     types {
       type_ {
         name
       }
     }
    }
  }
|}
];

module Query = Apollo.Client.Query;

let component = ReasonReact.statelessComponent("PokemonContainer");

let se = ReasonReact.stringToElement;

let make = (_children) => {
  ...component,
  render: (_self) => {
    let pokemonQuery = PokemonQuery.make(~name="pikachu", ());
    <Query query=pokemonQuery>
      ...(
           (response, parse) =>
             switch response {
             | Loading => <div> (se("Loading")) </div>
             | Failed(error) => <div> (se(error)) </div>
             | Loaded(result) =>
               switch (parse @@ result)##pokemon {
               | Some(pokemon) => <div> (se(pokemon##name)) </div>
               | None => <div> (se("Nothing")) </div>
               }
             }
         )
    </Query>
  }
};
