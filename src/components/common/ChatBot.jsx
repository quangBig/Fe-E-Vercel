// import { useState } from "react";
// import { useChatStore } from "../../stores/useChatStore";

// export default function ChatBot({ token }) {
//     const { messages, sendMessage } = useChatStore();
//     const [input, setInput] = useState("");
//     const [open, setOpen] = useState(false);

//     const handleSend = () => {
//         if (!input.trim()) return;
//         sendMessage(input, token);
//         setInput("");
//     };

//     return (
//         <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
//             {/* nút mở/thu gọn */}
//             {!open && (
//                 <button
//                     onClick={() => setOpen(true)}
//                     className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700"
//                 >
//                     💬
//                 </button>
//             )}

//             {/* chat box */}
//             {open && (
//                 <div className="flex flex-col w-80 h-96 bg-white border rounded-lg shadow-lg overflow-hidden">
//                     {/* header */}
//                     <div className="bg-blue-600 text-white p-3 font-bold flex justify-between items-center">
//                         AppleBot
//                         <button onClick={() => setOpen(false)} className="text-white font-bold">
//                             ✖
//                         </button>
//                     </div>

//                     {/* message area */}
//                     <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
//                         {messages.map((msg, i) => (
//                             <div
//                                 key={i}
//                                 className={`px-3 py-2 rounded-lg max-w-[75%] ${msg.sender === "user"
//                                     ? "ml-auto bg-blue-500 text-white"
//                                     : "mr-auto bg-gray-200 text-gray-800"
//                                     }`}
//                             >
//                                 {msg.message}
//                             </div>
//                         ))}
//                     </div>

//                     {/* input area */}
//                     <div className="flex border-t p-2">
//                         <input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                             placeholder="Nhập tin nhắn..."
//                             className="flex-1 border rounded px-2 py-1"
//                         />
//                         <button
//                             onClick={handleSend}
//                             className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                         >
//                             Gửi
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
