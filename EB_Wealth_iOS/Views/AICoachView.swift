import SwiftUI

public struct AICoachView: View {
    public var onBack: () -> Void
    @EnvironmentObject private var firebaseService: FirebaseService

    @State private var inputPrompt: String = ""
    @State private var messages: [(id: String, isUser: Bool, text: String)] = [
        (id: UUID().uuidString, isUser: false,
         text: "Good day, Investor. I am your EB Wealth Intelligence Coach, powered by Gemini AI.\n\nAsk me about UK Stocks & Shares ISAs, ETF expense ratios, dividend taxes, SIPP pension allowances, or asset allocation strategies.")
    ]
    @State private var isThinking: Bool = false
    @State private var scrollProxy: ScrollViewProxy? = nil

    // Conversation history for context (role, text) — sent to Gemini
    private var conversationHistory: [(role: String, text: String)] {
        messages.dropFirst().map { msg in (role: msg.isUser ? "user" : "model", text: msg.text) }
    }

    public init(onBack: @escaping () -> Void = {}) {
        self.onBack = onBack
    }

    public var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack(spacing: 10) {
                Button(action: onBack) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(Color(hex: "00F0FF"))
                        .frame(width: 32, height: 32)
                        .background(Color(hex: "00F0FF").opacity(0.1))
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color(hex: "00F0FF").opacity(0.3), lineWidth: 1))
                }

                ZStack {
                    Circle().fill(Color(hex: "00F0FF").opacity(0.15)).frame(width: 36, height: 36)
                    Image(systemName: "cpu.fill").font(.system(size: 16)).foregroundColor(Color(hex: "00F0FF"))
                }
                VStack(alignment: .leading, spacing: 1) {
                    Text("EB AI Wealth Coach").font(.system(size: 14, weight: .bold)).foregroundColor(.white)
                    Text("Powered by Gemini · UK Investing Specialist")
                        .font(.system(size: 10)).foregroundColor(Color(hex: "94A3B8"))
                }
                Spacer()
                if isThinking {
                    HStack(spacing: 4) {
                        ProgressView().progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "00F0FF"))).scaleEffect(0.7)
                        Text("Thinking…").font(.system(size: 10)).foregroundColor(Color(hex: "94A3B8"))
                    }
                }
            }
            .padding(.horizontal, 16).padding(.vertical, 10)
            .background(Color(hex: "071322").opacity(0.95))

            Divider().background(Color(hex: "0F2338"))

            // Chat Messages
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(messages, id: \.id) { msg in
                            messageBubble(msg)
                                .id(msg.id)
                        }
                        if isThinking {
                            typingIndicator.id("typing")
                        }
                    }
                    .padding(16)
                }
                .onAppear { scrollProxy = proxy }
                .onChange(of: messages.count) { _ in
                    if let last = messages.last {
                        withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                    }
                }
                .onChange(of: isThinking) { thinking in
                    if thinking { withAnimation { proxy.scrollTo("typing", anchor: .bottom) } }
                }
            }

            // Suggested Prompts (only shown when no user messages yet)
            if messages.count == 1 {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(suggestedPrompts, id: \.self) { prompt in
                            Button(action: { sendMessage(prompt) }) {
                                Text(prompt)
                                    .font(.system(size: 11, weight: .medium))
                                    .foregroundColor(Color(hex: "00F0FF"))
                                    .padding(.horizontal, 10).padding(.vertical, 6)
                                    .background(Color(hex: "00F0FF").opacity(0.1))
                                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(hex: "00F0FF").opacity(0.3), lineWidth: 1))
                                    .cornerRadius(8)
                            }
                        }
                    }
                    .padding(.horizontal, 16).padding(.vertical, 8)
                }
                .background(Color(hex: "071322").opacity(0.8))
            }

            // Input Bar
            HStack(spacing: 10) {
                TextField("Ask your UK wealth coach…", text: $inputPrompt)
                    .padding(12)
                    .background(Color(hex: "0A1628").opacity(0.85))
                    .cornerRadius(10)
                    .foregroundColor(.white)
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF").opacity(0.3), lineWidth: 1))
                    .onSubmit { sendMessage(inputPrompt) }

                Button(action: { sendMessage(inputPrompt) }) {
                    Image(systemName: "paperplane.fill")
                        .foregroundColor(Color(hex: "040B14"))
                        .padding(12)
                        .background(isThinking || inputPrompt.trimmingCharacters(in: .whitespaces).isEmpty
                                    ? Color(hex: "00F0FF").opacity(0.4) : Color(hex: "00F0FF"))
                        .cornerRadius(10)
                }
                .disabled(isThinking || inputPrompt.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            .padding(12)
            .background(Color(hex: "071322").opacity(0.95))
        }
    }

    // MARK: - Sub-views

    private func messageBubble(_ msg: (id: String, isUser: Bool, text: String)) -> some View {
        HStack(alignment: .bottom, spacing: 8) {
            if msg.isUser { Spacer(minLength: 50) }

            if !msg.isUser {
                ZStack {
                    Circle().fill(Color(hex: "00F0FF").opacity(0.15)).frame(width: 28, height: 28)
                    Image(systemName: "cpu.fill").font(.system(size: 12)).foregroundColor(Color(hex: "00F0FF"))
                }
            }

            Text(msg.text)
                .font(.system(size: 14))
                .padding(12)
                .background(msg.isUser ? Color(hex: "00F0FF") : Color(hex: "0A1628").opacity(0.9))
                .foregroundColor(msg.isUser ? Color(hex: "040B14") : .white)
                .cornerRadius(msg.isUser ? 16 : 16)
                .overlay(RoundedRectangle(cornerRadius: 16)
                    .stroke(Color(hex: "00F0FF").opacity(msg.isUser ? 0 : 0.2), lineWidth: 1))

            if !msg.isUser { Spacer(minLength: 50) }
        }
        .transition(.opacity.combined(with: .scale(scale: 0.95, anchor: msg.isUser ? .bottomTrailing : .bottomLeading)))
    }

    private var typingIndicator: some View {
        HStack(alignment: .bottom, spacing: 8) {
            ZStack {
                Circle().fill(Color(hex: "00F0FF").opacity(0.15)).frame(width: 28, height: 28)
                Image(systemName: "cpu.fill").font(.system(size: 12)).foregroundColor(Color(hex: "00F0FF"))
            }
            HStack(spacing: 4) {
                ForEach(0..<3, id: \.self) { i in
                    Circle()
                        .fill(Color(hex: "94A3B8"))
                        .frame(width: 6, height: 6)
                        .opacity(0.6)
                        .animation(.easeInOut(duration: 0.5).repeatForever().delay(Double(i) * 0.15), value: isThinking)
                }
            }
            .padding(12)
            .background(Color(hex: "0A1628").opacity(0.9))
            .cornerRadius(16)
            Spacer(minLength: 50)
        }
    }

    private let suggestedPrompts = [
        "What is a Stocks & Shares ISA?",
        "Should I choose VWRP or VUAG?",
        "How does compound interest work?",
        "What is my CGT allowance?",
        "Explain SIPP tax relief",
        "Best ETFs for beginners UK?"
    ]

    // MARK: - Actions

    private func sendMessage(_ text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty, !isThinking else { return }

        let userMsg = (id: UUID().uuidString, isUser: true, text: trimmed)
        withAnimation { messages.append(userMsg) }
        inputPrompt = ""
        isThinking = true

        let history = conversationHistory
        firebaseService.askGemini(prompt: trimmed, conversationHistory: history) { response in
            withAnimation {
                isThinking = false
                messages.append((id: UUID().uuidString, isUser: false, text: response))
            }
        }
    }
}
