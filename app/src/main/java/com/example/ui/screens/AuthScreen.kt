package com.example.ui.screens

import android.app.Activity
import android.content.Context
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialCancellationException
import com.example.R
import com.example.ui.theme.*
import com.example.ui.viewmodel.AuthState
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

@Composable
fun AuthScreen(
    authState: AuthState,
    onLogin: (email: String, password: String) -> Unit,
    onSignUp: (firstName: String, email: String, password: String, ageRange: String, country: String) -> Unit,
    onGoogleSignIn: (email: String, name: String) -> Unit,
    onClearError: () -> Unit
) {
    var isRegisterMode by remember { mutableStateOf(false) }

    var firstName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var ageRange by remember { mutableStateOf("25–34") }
    var country by remember { mutableStateOf("United Kingdom") }

    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var isGoogleSigningIn by remember { mutableStateOf(false) }

    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Transparent)
            .padding(horizontal = 20.dp, vertical = 24.dp)
            .verticalScroll(scrollState),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        // Cosmic Brand Emblem
        Box(
            modifier = Modifier
                .size(60.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(
                    Brush.linearGradient(
                        listOf(Color(0xFF00F0FF), Color(0xFF0284C7))
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            Text("EB", color = Color.White, fontWeight = FontWeight.Black, fontSize = 24.sp)
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = "EB ",
                fontSize = 26.sp,
                fontWeight = FontWeight.Black,
                color = Color(0xFF00F0FF),
                letterSpacing = 1.sp
            )
            Text(
                text = "Wealth",
                fontSize = 26.sp,
                fontWeight = FontWeight.Black,
                color = Color(0xFFFBBF24),
                letterSpacing = 1.sp
            )
        }

        Text(
            text = "Institutional-Grade Investment Education & Intelligence",
            fontSize = 12.sp,
            color = Color(0xFF94A3B8),
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Bank-Style Card Container
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
            border = BorderStroke(1.dp, Color(0x3300F0FF))
        ) {
            Column(modifier = Modifier.padding(22.dp)) {
                // Google Sign-In One-Tap Button
                OutlinedButton(
                    onClick = {
                        isGoogleSigningIn = true
                        launchGoogleSignIn(
                            context = context,
                            onSuccess = { mail, name ->
                                isGoogleSigningIn = false
                                onGoogleSignIn(mail, name)
                            },
                            onError = {
                                isGoogleSigningIn = false
                            },
                            coroutineScope = coroutineScope
                        )
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("google_signin_button"),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Color(0x6600F0FF)),
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = Color(0x1A00F0FF),
                        contentColor = Color.White
                    )
                ) {
                    if (isGoogleSigningIn) {
                        CircularProgressIndicator(modifier = Modifier.size(18.dp), color = Color(0xFF00F0FF), strokeWidth = 2.dp)
                    } else {
                        Icon(Icons.Default.AccountCircle, contentDescription = null, tint = Color(0xFF00F0FF), modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Text("Sign in with Google", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Divider
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    HorizontalDivider(modifier = Modifier.weight(1f), color = Color(0x2200F0FF))
                    Text("  OR USE CLIENT VAULT  ", fontSize = 10.sp, color = Color(0xFF64748B), fontWeight = FontWeight.Bold)
                    HorizontalDivider(modifier = Modifier.weight(1f), color = Color(0x2200F0FF))
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Sign In / Register Segmented Toggle
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color(0x3300F0FF))
                        .padding(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (!isRegisterMode) Color(0xFF00F0FF) else Color.Transparent)
                            .clickable {
                                isRegisterMode = false
                                onClearError()
                            }
                            .padding(vertical = 10.dp)
                            .testTag("tab_sign_in"),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Sign In",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = if (!isRegisterMode) Color(0xFF040B14) else Color(0xFFCBD5E1)
                        )
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isRegisterMode) Color(0xFF00F0FF) else Color.Transparent)
                            .clickable {
                                isRegisterMode = true
                                onClearError()
                            }
                            .padding(vertical = 10.dp)
                            .testTag("tab_register"),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Create Account",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = if (isRegisterMode) Color(0xFF040B14) else Color(0xFFCBD5E1)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Error / Feedback Banner
                if (authState is AuthState.Error) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        shape = RoundedCornerShape(10.dp),
                        color = Color(0x33E11D48),
                        border = BorderStroke(1.dp, Color(0xFFE11D48))
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.ErrorOutline, contentDescription = null, tint = Color(0xFFF43F5E), modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = authState.message,
                                color = Color.White,
                                fontSize = 12.sp,
                                lineHeight = 16.sp
                            )
                        }
                    }
                }

                if (isRegisterMode) {
                    // Legal First Name
                    Text("FULL LEGAL FIRST NAME", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF94A3B8), letterSpacing = 0.5.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = firstName,
                        onValueChange = {
                            firstName = it
                            if (authState is AuthState.Error) onClearError()
                        },
                        placeholder = { Text("e.g. Charlotte", color = Color(0xFF64748B), fontSize = 13.sp) },
                        leadingIcon = {
                            Icon(Icons.Default.Person, contentDescription = null, tint = Color(0xFF00F0FF), modifier = Modifier.size(18.dp))
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("auth_first_name_input"),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedContainerColor = Color(0x2200F0FF),
                            unfocusedContainerColor = Color(0x1500F0FF),
                            focusedBorderColor = Color(0xFF00F0FF),
                            unfocusedBorderColor = Color(0x3300F0FF)
                        ),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(14.dp))
                }

                // Email Address
                Text("EMAIL ADDRESS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF94A3B8), letterSpacing = 0.5.sp)
                Spacer(modifier = Modifier.height(4.dp))
                OutlinedTextField(
                    value = email,
                    onValueChange = {
                        email = it
                        if (authState is AuthState.Error) onClearError()
                    },
                    placeholder = { Text("e.g. name@example.co.uk", color = Color(0xFF64748B), fontSize = 13.sp) },
                    leadingIcon = {
                        Icon(Icons.Default.Email, contentDescription = null, tint = Color(0xFF00F0FF), modifier = Modifier.size(18.dp))
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("auth_email_input"),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedContainerColor = Color(0x2200F0FF),
                        unfocusedContainerColor = Color(0x1500F0FF),
                        focusedBorderColor = Color(0xFF00F0FF),
                        unfocusedBorderColor = Color(0x3300F0FF)
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Password
                Text("ACCOUNT PASSWORD", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF94A3B8), letterSpacing = 0.5.sp)
                Spacer(modifier = Modifier.height(4.dp))
                OutlinedTextField(
                    value = password,
                    onValueChange = {
                        password = it
                        if (authState is AuthState.Error) onClearError()
                    },
                    placeholder = { Text("Minimum 6 characters", color = Color(0xFF64748B), fontSize = 13.sp) },
                    leadingIcon = {
                        Icon(Icons.Default.Lock, contentDescription = null, tint = Color(0xFF00F0FF), modifier = Modifier.size(18.dp))
                    },
                    trailingIcon = {
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(
                                if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = if (passwordVisible) "Hide password" else "Show password",
                                tint = Color(0xFF94A3B8),
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    },
                    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("auth_password_input"),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedContainerColor = Color(0x2200F0FF),
                        unfocusedContainerColor = Color(0x1500F0FF),
                        focusedBorderColor = Color(0xFF00F0FF),
                        unfocusedBorderColor = Color(0x3300F0FF)
                    ),
                    singleLine = true
                )

                if (isRegisterMode) {
                    Spacer(modifier = Modifier.height(14.dp))

                    Row(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("AGE GROUP", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF94A3B8))
                            Spacer(modifier = Modifier.height(4.dp))
                            OutlinedTextField(
                                value = ageRange,
                                onValueChange = { ageRange = it },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White,
                                    focusedBorderColor = Color(0xFF00F0FF),
                                    unfocusedBorderColor = Color(0x3300F0FF)
                                ),
                                singleLine = true
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text("RESIDENCE", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF94A3B8))
                            Spacer(modifier = Modifier.height(4.dp))
                            OutlinedTextField(
                                value = country,
                                onValueChange = { country = it },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White,
                                    focusedBorderColor = Color(0xFF00F0FF),
                                    unfocusedBorderColor = Color(0x3300F0FF)
                                ),
                                singleLine = true
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Primary Submit Button
                Button(
                    onClick = {
                        if (isRegisterMode) {
                            onSignUp(firstName, email, password, ageRange, country)
                        } else {
                            onLogin(email, password)
                        }
                    },
                    enabled = authState !is AuthState.Loading,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00F0FF)),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .testTag("auth_submit_button")
                ) {
                    if (authState is AuthState.Loading) {
                        CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color(0xFF040B14), strokeWidth = 2.dp)
                    } else {
                        Text(
                            text = if (isRegisterMode) "Register & Start Onboarding" else "Sign In to Vault",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = Color(0xFF040B14)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Footer Mode Switcher
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            isRegisterMode = !isRegisterMode
                            onClearError()
                        },
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isRegisterMode) "Already have an account? " else "Don't have an account? ",
                        fontSize = 13.sp,
                        color = Color(0xFF94A3B8)
                    )
                    Text(
                        text = if (isRegisterMode) "Sign In" else "Create one now",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF00F0FF)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Security Assurance
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            color = Color(0x99071322),
            border = BorderStroke(1.dp, Color(0x2800F0FF))
        ) {
            Row(
                modifier = Modifier.padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.CloudDone, contentDescription = null, tint = Color(0xFF34D399), modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "Firebase Firestore Cloud Encrypted Vault",
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        color = Color.White
                    )
                    Text(
                        text = "Protected by Google Cloud Firestore with real-time replication. All user accounts and investment portfolios are safely synced to the cloud.",
                        fontSize = 11.sp,
                        color = Color(0xFF94A3B8),
                        lineHeight = 15.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(30.dp))
    }
}

private fun launchGoogleSignIn(
    context: Context,
    onSuccess: (email: String, name: String) -> Unit,
    onError: (String) -> Unit,
    coroutineScope: CoroutineScope
) {
    val clientId = try {
        context.getString(R.string.default_web_client_id)
    } catch (e: Exception) {
        null
    }

    if (clientId.isNullOrBlank()) {
        onError("Google Client ID configuration not found")
        return
    }

    val credentialManager = CredentialManager.create(context)
    val signInOption = GetSignInWithGoogleOption.Builder(serverClientId = clientId).build()
    val request = GetCredentialRequest.Builder().addCredentialOption(signInOption).build()

    coroutineScope.launch {
        try {
            val result = credentialManager.getCredential(context as Activity, request)
            val credential = result.credential
            if (credential is CustomCredential && credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
                val googleIdToken = GoogleIdTokenCredential.createFrom(credential.data)
                val email = googleIdToken.id
                val name = googleIdToken.displayName ?: email.substringBefore("@")
                onSuccess(email, name)
            } else {
                onError("Unexpected credential format received")
            }
        } catch (e: GetCredentialCancellationException) {
            // Dismissed or cancelled by user
        } catch (e: Exception) {
            onError(e.localizedMessage ?: "Google Sign-In failed")
        }
    }
}
