import { approveApplication, getUserAccount } from "../contractUtils";
import { updateAppStatus } from "../dbUtils";

// Generate dynamic color for fund tag based on fund name
export const getDynamicColor = (title) => {
    const colors = [
      "#d4edda",
      "#fff3cd",
      "#f8d7da",
      "#d1ecf1",
      "#f2d7ee",
      "#e8e8e8",
    ]; // Array of predefined colors
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash); // Simple hash
    }
    const index = Math.abs(hash) % colors.length; // Map hash to a color
    return colors[index];
  };