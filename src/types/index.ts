export interface Match {
  id: string;
  team1: {
    name: string;
    logo: string;
  };
  team2: {
    name: string;
    logo: string;
  };
  date: string;
  time: string;
}

export interface User {
  id: string;
  password: string;
}

export interface LoginForm {
  id: string;
  password: string;
} 