isMult = (num, mult) ->
  (num % mult) is 0

isMult3 = (num) -> isMult num, 3
isMult5 = (num) -> isMult num, 5

fizzBuzz = ->
  print = (args...) -> console.log.apply(console, args)
  output = (num) ->
    is3 = isMult3 num
    is5 = isMult5 num
    
    unless is3 or is5
      print num
      return

    output = ""
    output += "Fizz" if is3
    output += "Buzz" if is5

    print output
    null
  
  output num for num in [1..100]

fizzBuzz()