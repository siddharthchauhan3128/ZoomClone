import { createContext , useState , useContext} from "react";
const HistoryContext = createContext();
const API_URL = 'http://localhost:8080/api/auth';

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState([]);

    const getHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/getActivity?token=${token}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setHistory(data);
        console.log(data);

        return data;
        } catch (error) {
            console.error("Error fetching history:",error)
        }
    };

    const addToHistory = async (meeting) => {
        try {
            const token = localStorage.getItem('token'); 

            const response = await fetch(`${API_URL}/addToActivity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // POST requests are allowed to have a body, so this is perfectly fine!
                body: JSON.stringify({ token: token, meeting: meeting })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            await getHistory();
            
            console.log("Meeting Added:", data);
            return data;
            
        } catch (error) {
            console.error("Error adding to history:", error);
        }
    };

    return (
        <HistoryContext.Provider value={{ history, getHistory, addToHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};
export const useHistory = () => useContext(HistoryContext);