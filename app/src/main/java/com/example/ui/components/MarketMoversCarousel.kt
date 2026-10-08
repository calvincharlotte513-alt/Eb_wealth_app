package com.example.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.ResearchAsset
import com.example.ui.theme.*

@Composable
fun MarketMoversCarousel(
    assets: List<ResearchAsset>,
    onSelectAsset: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "FEATURED MARKET ASSETS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = GoldAccent,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Live UK & Global Movers",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = DarkCharcoal
                )
            }
            Text(
                text = "Swipe →",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = RoyalBluePrimary
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(scrollState),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            assets.forEach { asset ->
                Card(
                    modifier = Modifier
                        .width(185.dp)
                        .clickable { onSelectAsset(asset.ticker) },
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder().copy(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                RoyalBluePrimary.copy(alpha = 0.25f),
                                BorderSubtle
                            )
                        )
                    )
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                color = if (asset.assetType == "ETF") RoyalBlueContainer else EmeraldGreenContainer,
                                shape = RoundedCornerShape(4.dp)
                            ) {
                                Text(
                                    text = asset.assetType,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (asset.assetType == "ETF") OnRoyalBlueContainer else OnEmeraldGreenContainer,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }

                            val isPos = asset.dayChangePercent >= 0
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    if (isPos) Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                                    contentDescription = null,
                                    tint = if (isPos) EmeraldGreen else Color(0xFFE11D48),
                                    modifier = Modifier.size(13.dp)
                                )
                                Spacer(modifier = Modifier.width(2.dp))
                                Text(
                                    text = "${if (isPos) "+" else ""}${String.format("%.1f", asset.dayChangePercent)}%",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isPos) EmeraldGreen else Color(0xFFE11D48)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = asset.ticker,
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 17.sp,
                            color = DarkCharcoal
                        )

                        Text(
                            text = asset.name,
                            fontSize = 11.sp,
                            color = TextMuted,
                            maxLines = 1
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = "£${String.format("%.2f", asset.priceGbp)}",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = DarkCharcoal
                        )

                        Text(
                            text = "Yield: ${asset.dividendYield}",
                            fontSize = 10.sp,
                            color = TextMuted
                        )
                    }
                }
            }
        }
    }
}
