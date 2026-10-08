import SwiftUI

public struct AICoachView: View {
    @State private var inputPrompt: String = ""
    @State private var messages: [(isUser: Bool, text: String)] = [
        (isUser: false, text: "Good day, Investor. I am your EB Wealth Intelligence Coach. Ask me about UK Stocks & Shares ISAs, ETF expense ratios, dividend taxes, or asset allocation strategies.")
    ]
    
    public init() {}
    
    public var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(0..<messages.count, id: \.self) { idx in
                        let msg = messages[idx]
                        HStack {
                            if msg.isUser { Spacer() }
                            Text(msg.text)
                                .font(.system(size: 14))
                                .padding(12)
                                .background(msg.isUser ? Color(hex: "00F0FF") : Color(hex: "0A1628").opacity(0.85))
                                .foregroundColor(msg.isUser ? Color(hex: "040B14") : .white)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "00F0FF").opacity(msg.isUser ? 0 : 0.25), lineWidth: 1))
                            if !msg.isUser { Spacer() }
                        }
                    }
                }
                .padding(16)
            }
            
            HStack(spacing: 10) {
                TextField("Ask wealth coach...", text: $inputPrompt)
                    .padding(12)
                    .background(Color(hex: "0A1628").opacity(0.8))
                    .cornerRadius(10)
                    .foregroundColor(.white)
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF").opacity(0.3), lineWidth: 1))
                
                Button(action: sendMessage) {
                    Image(systemName: "paperplane.fill")
                        .foregroundColor(Color(hex: "040B14"))
                        .padding(12)
                        .background(Color(hex: "00F0FF"))
                        .cornerRadius(10)
                }
                .disabled(inputPrompt.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            .padding(12)
            .background(Color(hex: "071322").opacity(0.95))
        }
    }
    
    private func sendMessage() {
        let text = inputPrompt.trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty else { return }
        messages.append((isUser: true, text: text))
        inputPrompt = ""
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            messages.append((isUser: false, text: "For UK investors, utilising your £20,000 annual ISA allowance allows dividends, interest, and capital gains to compound completely free of UK tax. Always prioritize broad global low-cost index ETFs (like VWRP) before individual stock picking."))
        }
    }
}
