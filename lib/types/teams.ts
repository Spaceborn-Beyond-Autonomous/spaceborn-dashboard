import { Project } from "./projects";
import { User } from "./users";

export interface Team {
    id: number;
    name: string;
    lead_id?: number | null;           // optional and nullable lead user ID
    lead?: User | null;                // optional lead user object, if populated
    members?: User[];                  // optional array of User objects as members
    projects?: Project[];              // optional array of Project objects
    member_ids?: number[] | null;      // optional array of member user IDs (runtime-only)
}