import "./style.css";
import axios /* ,{AxiosError, AxiosResponse} */ from "axios";
import { z } from "zod";

const teamsURL = "http://localhost:8080/api/teams"
const voteURL = "http://localhost:8080/api/votes"

const teamsResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  players: z.object({
    id: z.number(),
    name: z.string()
  }).array()
}).array()


type Responsecteams = z.infer<typeof teamsResponseSchema>;


let teamselector = document.getElementById("teamselector")as HTMLInputElement





const getTeams = async (apiURLResfresh: string) => {
  const response = await axios.get(apiURLResfresh);
  const data = response.data;
  const result = teamsResponseSchema.safeParse(data);
  if (!result.success) {
    return null;
  }
  renderTeams(result.data)
  return data;
}

getTeams(teamsURL)

teamselector.addEventListener("change", () =>{
  getTeams(teamsURL + `?name=` + teamselector.value)
})

const renderTeams = (teams: Responsecteams) =>{
  document.getElementById("teamsrender")!.innerHTML =
  ` 
  <div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th>Player Name</th>
        <th>Team Name</th>
        <th>Vote</th>
      </tr>
    </thead>
    <tbody>
      <!-- row 1 -->

        ${teams.map(team => team.players.map(player => 
          `<tr>
          <td>${player.name}</td>
          <td>${team.name}</td>
          <td><button class="btn" id="${player.id}" >VOTE</button></td>
          </tr>`
          ).join("")).join("")}
      <!-- row 2 -->
    </tbody>
  </table>
</div>
`
  for(const team of teams){
    for(const player of team.players){
      document.getElementById("" + player.id)!.addEventListener("click", vote)
    }
  }
}


const vote = async (event: MouseEvent) => {
  const response = await  axios.post( voteURL, {playerId: + (event.target as HTMLButtonElement).id});
  response
};



