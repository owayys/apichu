$(document).ready(function() {
    
    var validName = true;
    
    const sendRequest = (pokemon) => {

        const pokiman_url = "https://pokeapi.co/api/v2/pokemon/"
        const species_url = "https://pokeapi.co/api/v2/pokemon-species/"
        const sprites_url = "https://img.pokemondb.net/artwork/"

        let poke_api_promise = fetch(pokiman_url + pokemon)

        poke_api_promise
            .then((res) => {
                return res.json()
            })
            .then((poke_api_response) => {
                console.log(poke_api_response)
                $("#card-title-left").text(poke_api_response.name.replace(/-/g, ' '))
                $("#height").text(`${poke_api_response.height / 10} m`)
                $("#weight").text(`${poke_api_response.weight / 10} kg`)

                abilities = poke_api_response.abilities

                for(let i = 0; i < abilities.length; i++) {
                    $(`#ability-${i}`).text(abilities[i].ability.name)
                }

                types = poke_api_response.types

                $("#type-row").empty();

                for(let i = 0; i < types.length; i++) {
                    $("#type-row").append(`<div class="type-icon type-${types[i].type.name}">${types[i].type.name}</div>`)
                }

                pokemon_stats = poke_api_response.stats 

                per_hp = ( pokemon_stats[0].base_stat / 255 ) * 100
                per_atk = ( pokemon_stats[1].base_stat / 190 ) * 100
                per_def = ( pokemon_stats[2].base_stat / 230 ) * 100
                per_spatk = ( pokemon_stats[3].base_stat / 194 ) * 100
                per_spdef = ( pokemon_stats[4].base_stat / 230 ) * 100
                per_spd = ( pokemon_stats[5].base_stat / 180 ) * 100

                $(".0-max").text(`${pokemon_stats[0].base_stat}`)
                $(".1-max").text(`${pokemon_stats[1].base_stat}`)
                $(".2-max").text(`${pokemon_stats[2].base_stat}`)
                $(".3-max").text(`${pokemon_stats[3].base_stat}`)
                $(".4-max").text(`${pokemon_stats[4].base_stat}`)
                $(".5-max").text(`${pokemon_stats[5].base_stat}`)

                $(".hp").css("width", `${per_hp}%`)
                $(".attack").css("width", `${per_atk}%`)
                $(".defense").css("width", `${per_def}%`)
                $(".special-attack").css("width", `${per_spatk}%`)
                $(".special-defense").css("width", `${per_spdef}%`)
                $(".speed").css("width", `${per_spd}%`)

                return poke_api_response.name;
            })
            .then((pokemon_name) => {
                iconUrl = `https://img.pokemondb.net/artwork/${pokemon_name}.jpg`
                $("#icon-image").attr("src", iconUrl);

                $("#evo-1").attr("src", null);
                $("#evo-2").attr("src", null);
            })
            .catch((e) => {
                $("#card").css("visibility", "hidden")
                alert("Please Enter a VALID Pokemon name")
            })


        let species_promise = fetch(species_url + pokemon)

        species_promise
            .then((res) => {
                return res.json()
            })
            .then((species_response) => {
                console.log(species_response)
                chain_url = species_response.evolution_chain.url
                pokemon_info_array = species_response.flavor_text_entries

                for(let i = 0; i < pokemon_info_array.length; i++) {
                    if(pokemon_info_array[i].language.name === "en") {
                        pokemon_info = pokemon_info_array[i].flavor_text
                        break
                    }
                }

                pokemon_info = pokemon_info.replace(/\r?\u000c|\r/g, " ");
                $("#pokemon-info").text(pokemon_info)
                $("#pokemon-info2").text(pokemon_info)
                return chain_url
            })
            .then((chain_url) => {
                let chain_promise = fetch(chain_url)
                return chain_promise
            })
            .then((chain_promise) => {
                return chain_promise.json()
            })
            .then((chain_response) => {
                console.log(chain_response)

                evo_1 = chain_response.chain.species.name
                console.log(evo_1)
            
                evo_2 = chain_response.chain.evolves_to[0].species.name
                console.log(evo_2)

                if (chain_response.chain.evolves_to[0].evolves_to[0]) {
                    evo_3 = chain_response.chain.evolves_to[0].evolves_to[0].species.name
                    console.log(evo_3)
                }
                else {
                    evo_3 = null
                }

                chainArr = [evo_1, evo_2, evo_3];

                counter = 1;

                for(let i = 0; i < chainArr.length; i++) {
                    if (chainArr[i] != pokemon && chainArr[i] != null) {
                        $(`#evo-${counter}`).attr("src", sprites_url + chainArr[i] + ".jpg");
                        counter++;
                    }
                }
            })
            .catch((e) => {
                console.log(e)
            })

            setTimeout(function(){
                $('#card').css("top", "1000px");
            },600);

            setTimeout(function(){
                $('#card').css("opacity", "1");
            },600);

            $('#icon-image').onload = setTimeout(function(){
                $('#card').css("animation", "slide-in 1s forwards");
            },1000);

            $("#card").css("visibility", "visible")
    }

    $("#form1").submit(function(e) {
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
        $('#card').css("animation", "slide-off 0.7s forwards");

        $("header").addClass('header-collapse');
        $("#logo").addClass('logo-collapse')
        $("input").addClass('search-collapse')
        $("#button-1").addClass('search-collapse')
            
        $('.undercard').css("opacity", "1");
        $('.undercard').css("animation", "slide-in 0.7s forwards");

        var pokemon = $("#search-entry").val().toLowerCase();
        pokemon = pokemon.replace(/\s+/g, '-')
        console.log(pokemon)
        setTimeout(function(){
            sendRequest(pokemon);
        },500);

        $("#form1 :input").val("");
    })
})