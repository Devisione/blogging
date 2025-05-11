import CalendarScreen from "@screens/Calendar";
import { withAuthGuard } from "../components/HOCS/withAuthGuard";

const CalendarPage = () => {
  return <CalendarScreen />;
};

export default withAuthGuard(CalendarPage);
