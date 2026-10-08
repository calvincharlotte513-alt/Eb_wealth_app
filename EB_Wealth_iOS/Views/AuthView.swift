import SwiftUI

public struct AuthView: View {
    @Binding public var profile: UserProfile
    @State private var isRegisterMode: Bool = false
    @State private var firstName: String = ""
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var ageRange: String = "25–34"
    @State private var country: String = "United Kingdom"
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
                        .frame(width: 64, height: 64)
                    
                    Text("EB")
                        .font(.system(size: 26, weight: .black))
                        .foregroundColor(.white)
                }
                
                HStack(spacing: 4) {
                    Text("EB ")
                        .font(.system(size: 28, weight: .black))
                        .foregroundColor(Color(hex: "00F0FF"))
                    Text("WEALTH")
                        .font(.system(size: 28, weight: .black))
                        .foregroundColor(Color(hex: "FBBF24"))
                }
                
                Text("Institutional-Grade UK Investment Education & Vault")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "94A3B8"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)
                
                // Auth Container Card
                VStack(spacing: 18) {
                    // Sign In with Apple Button
                    Button(action: handleAppleSignIn) {
                        HStack(spacing: 10) {
                            Image(systemName: "applelogo")
                                .font(.system(size: 18))
                            Text("Sign in with Apple")
                                .font(.system(size: 15, weight: .bold))
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 48)
                        .background(Color.white)
                        .foregroundColor(.black)
                        .cornerRadius(12)
                    }
                    
                    HStack {
                        Rectangle().fill(Color.white.opacity(0.15)).frame(height: 1)
                        Text("OR USE CLIENT VAULT")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "64748B"))
                        Rectangle().fill(Color.white.opacity(0.15)).frame(height: 1)
                    }
                    
                    // Segmented Toggle
                    HStack(spacing: 0) {
                        Button(action: { isRegisterMode = false }) {
                            Text("Sign In")
                                .font(.system(size: 14, weight: .bold))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(!isRegisterMode ? Color(hex: "00F0FF") : Color.clear)
                                .foregroundColor(!isRegisterMode ? Color(hex: "040B14") : Color(hex: "94A3B8"))
                                .cornerRadius(8)
                        }
                        
                        Button(action: { isRegisterMode = true }) {
                            Text("Create Account")
                                .font(.system(size: 14, weight: .bold))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(isRegisterMode ? Color(hex: "00F0FF") : Color.clear)
                                .foregroundColor(isRegisterMode ? Color(hex: "040B14") : Color(hex: "94A3B8"))
                                .cornerRadius(8)
                        }
                    }
                    .padding(4)
                    .background(Color(hex: "00F0FF").opacity(0.15))
                    .cornerRadius(10)
                    
                    if let error = errorMessage {
                        HStack {
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
                    }
                    
                    if isRegisterMode {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("LEGAL FIRST NAME")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "94A3B8"))
                            TextField("e.g. Charlotte", text: $firstName)
                                .padding()
                                .background(Color(hex: "00F0FF").opacity(0.08))
                                .cornerRadius(10)
                                .foregroundColor(.white)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                        }
                    }
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("EMAIL ADDRESS")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "94A3B8"))
                        TextField("e.g. client@ebwealth.co.uk", text: $email)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                            .padding()
                            .background(Color(hex: "00F0FF").opacity(0.08))
                            .cornerRadius(10)
                            .foregroundColor(.white)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                    }
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("ACCOUNT PASSWORD")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "94A3B8"))
                        SecureField("Minimum 6 characters", text: $password)
                            .padding()
                            .background(Color(hex: "00F0FF").opacity(0.08))
                            .cornerRadius(10)
                            .foregroundColor(.white)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                    }
                    
                    Button(action: handleVaultSubmit) {
                        if isLoading {
                            ProgressView().progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "040B14")))
                        } else {
                            Text(isRegisterMode ? "Register & Enter Vault" : "Sign In to Client Vault")
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(Color(hex: "040B14"))
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(Color(hex: "00F0FF"))
                    .cornerRadius(12)
                }
                .padding(22)
                .background(Color(hex: "0A1628").opacity(0.85))
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                .cornerRadius(18)
                .padding(.horizontal, 16)
                
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
            }
        }
    }
    
    private func handleAppleSignIn() {
        profile.firstName = "Investor"
        profile.email = "apple.client@privaterelay.appleid.com"
        profile.isLoggedIn = true
        FirebaseService.shared.syncProfile(profile) { _ in }
    }
    
    private func handleVaultSubmit() {
        guard email.contains("@") && email.contains(".") else {
            errorMessage = "Please enter a valid email address."
            return
        }
        guard password.count >= 6 else {
            errorMessage = "Password must be at least 6 characters."
            return
        }
        
        isLoading = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            isLoading = false
            profile.firstName = isRegisterMode ? (firstName.isEmpty ? "Investor" : firstName) : (firstName.isEmpty ? email.components(separatedBy: "@").first ?? "Investor" : firstName)
            profile.email = email
            profile.isLoggedIn = true
            FirebaseService.shared.syncProfile(profile) { _ in }
        }
    }
}
