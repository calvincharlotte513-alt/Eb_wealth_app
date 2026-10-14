import SwiftUI

public struct AuthView: View {
    @Binding public var profile: UserProfile
    @EnvironmentObject private var firebaseService: FirebaseService

    @State private var isRegisterMode: Bool = false
    @State private var firstName: String = ""
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var errorMessage: String? = nil
    @State private var isLoading: Bool = false

    public init(profile: Binding<UserProfile>) {
        self._profile = profile
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Spacer().frame(height: 30)

                // EB Wealth Brand Badge
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(LinearGradient(
                            colors: [Color(hex: "00F0FF"), Color(hex: "0284C7")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ))
                        .frame(width: 68, height: 68)
                        .shadow(color: Color(hex: "00F0FF").opacity(0.4), radius: 12, x: 0, y: 6)

                    Text("EB")
                        .font(.system(size: 28, weight: .black))
                        .foregroundColor(.white)
                }

                HStack(spacing: 4) {
                    Text("EB ")
                        .font(.system(size: 30, weight: .black))
                        .foregroundColor(Color(hex: "00F0FF"))
                    Text("WEALTH")
                        .font(.system(size: 30, weight: .black))
                        .foregroundColor(Color(hex: "FBBF24"))
                }

                Text("Institutional-Grade UK Investment Education & Vault")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "94A3B8"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)

                // Auth Container Card
                VStack(spacing: 18) {
                    // Segmented Toggle
                    HStack(spacing: 0) {
                        authTab(title: "Sign In", isActive: !isRegisterMode) { isRegisterMode = false }
                        authTab(title: "Create Account", isActive: isRegisterMode) { isRegisterMode = true }
                    }
                    .padding(4)
                    .background(Color(hex: "00F0FF").opacity(0.12))
                    .cornerRadius(10)

                    // Error Banner
                    if let error = errorMessage {
                        HStack(spacing: 8) {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(Color(hex: "F43F5E"))
                            Text(error)
                                .font(.system(size: 12))
                                .foregroundColor(.white)
                        }
                        .padding(10)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(hex: "E11D48").opacity(0.2))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(hex: "E11D48"), lineWidth: 1))
                        .cornerRadius(8)
                        .transition(.opacity.combined(with: .move(edge: .top)))
                    }

                    // First Name (register only)
                    if isRegisterMode {
                        authField(label: "LEGAL FIRST NAME", placeholder: "e.g. Charlotte", text: $firstName)
                    }

                    authField(label: "EMAIL ADDRESS", placeholder: "e.g. client@ebwealth.co.uk", text: $email, keyboard: .emailAddress)

                    authSecureField(label: "ACCOUNT PASSWORD", placeholder: "Minimum 6 characters", text: $password)

                    // Submit Button
                    Button(action: handleVaultSubmit) {
                        ZStack {
                            if isLoading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "040B14")))
                            } else {
                                Text(isRegisterMode ? "Register & Enter Vault" : "Sign In to Client Vault")
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(Color(hex: "040B14"))
                            }
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(isLoading ? Color(hex: "00F0FF").opacity(0.6) : Color(hex: "00F0FF"))
                    .cornerRadius(12)
                    .disabled(isLoading)
                    .animation(.easeInOut(duration: 0.2), value: isLoading)
                }
                .padding(22)
                .background(Color(hex: "0A1628").opacity(0.90))
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                .cornerRadius(18)
                .padding(.horizontal, 16)
                .animation(.easeInOut(duration: 0.25), value: isRegisterMode)

                // Security Badge
                HStack(spacing: 12) {
                    Image(systemName: "lock.shield.fill")
                        .font(.system(size: 22))
                        .foregroundColor(Color(hex: "34D399"))
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Firebase Firestore Cloud Vault")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                        Text("All user data and portfolio holdings are replicated in real-time to Google Cloud.")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                }
                .padding(14)
                .background(Color(hex: "071322").opacity(0.7))
                .cornerRadius(12)
                .padding(.horizontal, 16)

                Spacer().frame(height: 30)
            }
        }
    }

    // MARK: - Sub-views

    private func authTab(title: String, isActive: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 14, weight: .bold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(isActive ? Color(hex: "00F0FF") : Color.clear)
                .foregroundColor(isActive ? Color(hex: "040B14") : Color(hex: "94A3B8"))
                .cornerRadius(8)
        }
    }

    private func authField(
        label: String, placeholder: String, text: Binding<String>,
        keyboard: UIKeyboardType = .default
    ) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(Color(hex: "94A3B8"))
            TextField(placeholder, text: text)
                .keyboardType(keyboard)
                .autocapitalization(.none)
                .autocorrectionDisabled()
                .padding()
                .background(Color(hex: "00F0FF").opacity(0.08))
                .cornerRadius(10)
                .foregroundColor(.white)
                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
        }
    }

    private func authSecureField(label: String, placeholder: String, text: Binding<String>) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(Color(hex: "94A3B8"))
            SecureField(placeholder, text: text)
                .padding()
                .background(Color(hex: "00F0FF").opacity(0.08))
                .cornerRadius(10)
                .foregroundColor(.white)
                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
        }
    }

    // MARK: - Actions

    private func handleVaultSubmit() {
        withAnimation { errorMessage = nil }

        guard email.contains("@") && email.contains(".") else {
            withAnimation { errorMessage = "Please enter a valid email address." }
            return
        }
        guard password.count >= 6 else {
            withAnimation { errorMessage = "Password must be at least 6 characters." }
            return
        }

        isLoading = true

        if isRegisterMode {
            let name = firstName.trimmingCharacters(in: .whitespaces).isEmpty
                ? email.components(separatedBy: "@").first ?? "Investor"
                : firstName.trimmingCharacters(in: .whitespaces)

            firebaseService.signUp(email: email, password: password, firstName: name) { result in
                isLoading = false
                switch result {
                case .success(let auth):
                    var p = UserProfile()
                    p.id = auth.localId
                    p.firstName = name
                    p.email = auth.email
                    p.isLoggedIn = true
                    profile = p
                    // Write initial profile to Firestore
                    firebaseService.syncProfile(p) { _ in }
                case .failure(let err):
                    withAnimation { errorMessage = err }
                }
            }
        } else {
            firebaseService.signIn(email: email, password: password) { result in
                isLoading = false
                switch result {
                case .success(let auth):
                    // Fetch profile from Firestore
                    firebaseService.fetchProfile { fetchedProfile in
                        var p = fetchedProfile ?? UserProfile()
                        p.id = auth.localId
                        p.email = auth.email
                        if p.firstName.isEmpty { p.firstName = auth.displayName }
                        p.isLoggedIn = true
                        profile = p
                    }
                case .failure(let err):
                    withAnimation { errorMessage = err }
                }
            }
        }
    }
}
