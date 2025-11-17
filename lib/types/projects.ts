import { Meeting } from "./meetings";
import { Revenue } from "./revenue";
import { Task } from "./tasks";
import { Team } from "./teams";
import { User } from "./users";

export interface Project {
    id: number;
    name: string;
    description?: string | null;
    team_id?: number | null;
    owner_id?: number | null;
    created_at: string;  // ISO date string
    updated_at: string;  // ISO date string

    team?: Team;              // populated if included in backend response
    owner?: User;             // populated if included
    tasks?: Task[];           // populated if included
    revenues?: Revenue[];     // populated if included
    meetings?: Meeting[];     // populated if included
}