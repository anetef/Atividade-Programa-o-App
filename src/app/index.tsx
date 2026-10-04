import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function diasNoMes(ano: number, mes: number) {
  return new Date(ano, mes + 1, 0).getDate();
}

function adicionarMeses(data: Date, quantidade: number) {
  const primeiroDia = new Date(
    data.getFullYear(),
    data.getMonth() + quantidade,
    1
  );

  return new Date(
    primeiroDia.getFullYear(),
    primeiroDia.getMonth(),
    Math.min(
      data.getDate(),
      diasNoMes(primeiroDia.getFullYear(), primeiroDia.getMonth())
    )
  );
}

export default function Index() {
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [resultado, setResultado] = useState('');

  function calcularIdade() {
    const d = Number(dia);
    const m = Number(mes);
    const a = Number(ano);

    if (
      !/^\d{1,2}$/.test(dia) ||
      !/^\d{1,2}$/.test(mes) ||
      !/^\d{4}$/.test(ano) ||
      a < 1
    ) {
      Alert.alert('Data inválida', 'Preencha o dia, o mês e o ano completo.');
      return;
    }

    const nascimento = new Date(0);
    nascimento.setFullYear(a, m - 1, d);
    nascimento.setHours(0, 0, 0, 0);

    if (
      nascimento.getFullYear() !== a ||
      nascimento.getMonth() !== m - 1 ||
      nascimento.getDate() !== d
    ) {
      Alert.alert('Data inválida', 'Informe uma data de nascimento válida.');
      return;
    }

    const agora = new Date();
    const hoje = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate()
    );

    if (nascimento > hoje) {
      Alert.alert('Data inválida', 'O nascimento não pode estar no futuro.');
      return;
    }

    let totalMeses =
      (hoje.getFullYear() - a) * 12 + hoje.getMonth() - (m - 1);

    let referencia = adicionarMeses(nascimento, totalMeses);

    if (referencia > hoje) {
      totalMeses--;
      referencia = adicionarMeses(nascimento, totalMeses);
    }

    // UTC evita diferenças causadas pelo horário de verão.
    const dias = Math.round(
      (Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) -
        Date.UTC(
          referencia.getFullYear(),
          referencia.getMonth(),
          referencia.getDate()
        )) /
        86_400_000
    );

    const anos = Math.floor(totalMeses / 12);
    const meses = totalMeses % 12;

    setResultado(
      `${anos} ${anos === 1 ? 'ano' : 'anos'}, ` +
        `${meses} ${meses === 1 ? 'mês' : 'meses'} e ` +
        `${dias} ${dias === 1 ? 'dia' : 'dias'}`
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Calculadora de idade</Text>
        <Text style={styles.descricao}>
          Informe sua data de nascimento
        </Text>

        <View style={styles.campos}>
          <TextInput
            style={styles.input}
            placeholder="Dia"
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
            maxLength={2}
            value={dia}
            onChangeText={(texto) => {
              setDia(texto.replace(/\D/g, ''));
              setResultado('');
            }}
            accessibilityLabel="Dia de nascimento"
          />

          <TextInput
            style={styles.input}
            placeholder="Mês"
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
            maxLength={2}
            value={mes}
            onChangeText={(texto) => {
              setMes(texto.replace(/\D/g, ''));
              setResultado('');
            }}
            accessibilityLabel="Mês de nascimento"
          />

          <TextInput
            style={[styles.input, styles.inputAno]}
            placeholder="Ano"
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
            maxLength={4}
            value={ano}
            onChangeText={(texto) => {
              setAno(texto.replace(/\D/g, ''));
              setResultado('');
            }}
            accessibilityLabel="Ano de nascimento"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.botaoPressionado,
          ]}
          onPress={calcularIdade}
          accessibilityRole="button"
        >
          <Text style={styles.textoBotao}>Calcular idade</Text>
        </Pressable>

        {resultado !== '' && (
          <View style={styles.resultado}>
            <Text style={styles.rotulo}>Sua idade hoje é</Text>
            <Text style={styles.idade}>{resultado}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  campos: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 14,
    fontSize: 18,
    textAlign: 'center',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  inputAno: {
    flex: 1.4,
  },
  botao: {
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoPressionado: {
    opacity: 0.8,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultado: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    alignItems: 'center',
  },
  rotulo: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 8,
  },
  idade: {
    color: '#3730a3',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
});